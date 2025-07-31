/* eslint-disable no-console */
import { envVars } from "../config/env.config";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.validation";
import bcryptjs from "bcryptjs";

export const seedAdminToDB = async () => {
    try {
        const isAdminExistsInDB = await User.findOne({
            email: envVars.ADMIN_EMAIL,
        })

        if(isAdminExistsInDB) {
            console.log("Admin already exists in the database.");
            return;
        }
        console.log("Seeding admin to the database...");

        const encryptedPassword = await bcryptjs.hash(
            envVars.ADMIN_PASSWORD,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        )

        const adminPayload: Partial<IUser> = {
            name: "Admin",
            email: envVars.ADMIN_EMAIL,
            phone: "01711110000",
            password: encryptedPassword,
            role: Role.ADMIN,
            isApproved: true,
            isVerified: true, 
        }

        const admin = await User.create(adminPayload);
        console.log("Admin seeded successfully:", admin.email);
        console.log(admin);

    } catch (error) {
        console.error("Error seeding admin to DB:", error);
        throw error; 
    }
}