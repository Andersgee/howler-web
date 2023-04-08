import { z } from "zod";
import { startOfHour } from "date-fns";

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
          what: searchQuery ? { search: searchQuery } : undefined,
          when: {
            gte: startOfHour(input.when),
          },
        },
      });
    }),
  create: protectedProcedure
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
          creatorId: ctx.session.user.id,
          what: input.what.trim(),
          where: input.where.trim(),
          when: input.when,
          who: input.who,
          info: "",
        },
      });
    }),
  join: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userEventPivot.create({
        data: {
          eventId: input.eventId,
          userId: ctx.session.user.id,
        },
      });
    }),
  leave: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userEventPivot.delete({
        where: {
          userId_eventId: {
            eventId: input.eventId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  userEventPivot: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.userEventPivot.findUnique({
        where: {
          userId_eventId: {
            eventId: input.eventId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
