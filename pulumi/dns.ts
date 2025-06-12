import * as aws from '@pulumi/aws'
import * as cloudflare from '@pulumi/cloudflare'
import * as pulumi from '@pulumi/pulumi'

import * as apigateway from './apigateway'

const domainName = process.env.DOMAIN_NAME
if (!domainName) {
  throw new Error('DOMAIN_NAME is required')
}

// Cloudflare setup needs to be done manually
const cfZone = cloudflare.getZone({
  name: domainName,
})

const createSubdomainForStage = ({
  subdomain,
  apiId,
  stage,
}: {
  subdomain: string
  apiId: string
  stage: string
}) => {
  const apiFqdn = `${subdomain}.${domainName}`

  const cert = new aws.acm.Certificate('cert', {
    domainName: apiFqdn,
    validationMethod: 'DNS',
  })

  const acmRecord = new cloudflare.Record('api-acm-record', {
    zoneId: cfZone.then(z => z.id),

    name: cert.domainValidationOptions[0].resourceRecordName,
    type: cert.domainValidationOptions[0].resourceRecordType,
    content: cert.domainValidationOptions[0].resourceRecordValue,
    ttl: 300,

    comment: 'AWS ACM validation record',
  })

  const validation = new aws.acm.CertificateValidation('api-cert-validation', {
    certificateArn: cert.arn,
    validationRecordFqdns: [acmRecord.hostname],
  })

  const apiDomainName = new aws.apigatewayv2.DomainName(
    'apiDomainName',
    {
      domainName: apiFqdn,
      domainNameConfiguration: {
        certificateArn: cert.arn,
        endpointType: 'REGIONAL',
        securityPolicy: 'TLS_1_2',
      },
    },
    {
      dependsOn: [validation],
    },
  )

  new aws.apigatewayv2.ApiMapping(
    `${stage}ApiMapping`,
    {
      apiId,
      domainName: apiDomainName.domainName,
      stage,
    },
    {
      dependsOn: [apiDomainName],
    },
  )

  const _apiRecord = new cloudflare.Record(
    'api-cname',
    {
      zoneId: cfZone.then(z => z.id),
      name: subdomain,
      type: 'CNAME',
      // Need to point to the target domain name, not the endpoint,
      // in order to get the ACM certificate
      content: apiDomainName.domainNameConfiguration.targetDomainName,
    },
    {
      dependsOn: [validation, apiDomainName],
    },
  )
}

pulumi
  .all([apigateway.api.id, apigateway.prodStage.name])
  .apply(([apiId, stage]) => {
    // TODO(optional): change the api subdomain
    createSubdomainForStage({
      subdomain: 'api',
      apiId,
      stage,
    })
  })
