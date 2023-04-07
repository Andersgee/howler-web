import { prisma } from "src/server/db";

export const hej = 99;

export type Event = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

export async function getEvent(id: number) {
  return prisma.event.findUnique({ where: { id } });
}
