/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import passport from "passport";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { UserStatus } from "../modules/user/user.interface";

// Passport configuration for Local Authentication Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          return done(null, false, {
            message: "User does not exist!",
          });
        }

        if (
          existingUser.status === UserStatus.BLOCKED ||
          existingUser.status === UserStatus.INACTIVE
        ) {
          //* throw new AppError(httpStatus.BAD_REQUEST, "User is blocked or inactive!");
          return done(null, false, {
            message: "User is blocked or inactive!",
          });
        }
        if (existingUser.isDeleted) {
          //* throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
          return done(null, false, {
            message: "User is deleted!",
          });
        }

        if (!existingUser) {
          return done("User does not exist!");
        }

        // const isGoogleAuthenticated = existingUser.auths.some(
        //   (providerObjs) => providerObjs.provider === "google"
        // );

        // if (isGoogleAuthenticated && !existingUser.password) {
        //   return done(null, false, {
        //     message:
        //       "Please login with Google! You have registered with Google login. If you want to login with email and password, please at first login with Google and set a password for your Gmail.",
        //   });
        // }
        // if (isGoogleAuthenticated) {
        //   return done(
        //     "Please login with Google! You have registered with Google login. If you want to login with email and password, please at first login with Google and set a password for your Gmail."
        //   );
        // }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          existingUser.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Password does not match!",
          });
        }

        return done(null, existingUser);
      } catch (error) {
        console.error("Error during local authentication:", error);
        return done(error);
      }
    }
  )
);


// Serialize and deserialize user for session management >>>>
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: any) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);
