import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: {
          firstName: true,
          lastName: true,
        },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
      image: {
        needs: {
          image: true,
        },
        compute(user) {
          if (user.image) {
            return "/optimize" + user.image.split(".")[0] + ".webp";
          }
          return user.image;
        },
      },
    },
    post: {
      image: {
        needs: {
          image: true,
        },
        compute(post) {
          return "/optimize" + post.image.split(".")[0] + ".webp";
        },
      },
      updatedAt: {
        needs: {
          updatedAt: true,
        },
        compute(post) {
          return post?.updatedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
    },
  },
});
