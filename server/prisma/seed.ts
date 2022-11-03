import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@doe.com',
      avatarUrl: 'https://github.com/Akkihiko.png',
    }
  })

  const pool = await prisma.poll.create({
    data: {
      title: 'Example poll',
      code: 'ABC123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T18:00:00.201Z',
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR"
    }
  })
  
  await prisma.game.create({
    data: {
      date: '2022-11-03T18:00:00.201Z',
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()