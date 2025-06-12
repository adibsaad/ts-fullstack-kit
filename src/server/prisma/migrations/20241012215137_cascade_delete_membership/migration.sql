-- DropForeignKey
ALTER TABLE "UserTeamMembership" DROP CONSTRAINT "UserTeamMembership_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserTeamMembership" ADD CONSTRAINT "UserTeamMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
