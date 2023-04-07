import { z } from "zod";
import { startOfDay } from "date-fns";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";

/**
 * full text search has a special format to consider (with plus or minus)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search#mysql
 */
function searchAND(str: string | undefined) {
  if (!str || !str.trim()) return "";
  const q = str
    .trim()
    .split(" ")
    .map((s) => (s ? `+${s}` : ""))
    .join(" ");
  return `${q}*`;
}

function searchOR(str: string) {
  return str.trim();
}

export const eventRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        what: z.string().optional(),
        where: z.string().optional(),
        when: z.date(),
        who: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      const searchQuery = searchAND(input.what);
      return ctx.prisma.event.findMany({
        where: {
          title: searchQuery ? { search: searchQuery } : undefined,
          date: {
            gte: startOfDay(input.when),
          },
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        what: z.string(),
        where: z.string(),
        when: z.date(),
        who: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.event.create({
        data: {
          title: input.what,
          date: input.when,
          description: "no description yet",
        },
      });
    }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
