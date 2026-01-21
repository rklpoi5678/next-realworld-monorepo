// @see https://ngneat.github.io/falso/docs/getting-started/
// @ngneat/false 는 한글이 지원이 안됨
import {
  randAvatar,
  randCatchPhrase,
  randEmail,
  randFullName,
  randImg,
  randNumber,
  randParagraph,
  randPassword,
  randProduct,
  randSentence,
  randText,
} from '@ngneat/falso';

import prisma from '../src/libs/prisma.js';

async function main() {
  console.log('기존 데이터 삭제 시작...');
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.item.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('기존 데이터 삭제 완료.');

  const NUM_USERS_TO_CREATE = 5;
  console.log('시딩 시작');

  const userPromise = Array.from({ length: NUM_USERS_TO_CREATE }).map(() =>
    prisma.user.create({
      data: {
        name: randFullName(),
        email: randEmail(),
        password: randPassword(),
        userProfile: {
          create: {
            photoUrl: randAvatar(),
            bio: randCatchPhrase(),
          },
        },
      },
    }),
  );

  const users = await Promise.all(userPromise);

  const allPosts = [];
  for (const user of users) {
    const postPromises = Array.from({ length: NUM_USERS_TO_CREATE }).map(() => {
      const randomIndex = randNumber({ min: 0, max: users.length - 1 });
      const randomUser = users[randomIndex];

      return prisma.article.create({
        data: {
          title: randSentence(),
          content: randParagraph(),
          images: [
            randImg({ width: 100, height: 100 }),
            randImg({ width: 100, height: 100 }),
            randImg({ width: 100, height: 100 }),
          ],
          authorId: randomUser.id,
        },
      });
    });

    const userPosts = await Promise.all(postPromises);
    allPosts.push(...userPosts);
  }
  console.log(`${allPosts.length}개의 게시물이 생성되었습니다.`);

  for (const user of users) {
    const itemCount = randNumber({ min: 1, max: 7 });
    const itemPromises = Array.from({ length: itemCount }).map(() => {
      const randomIndex = randNumber({ min: 0, max: users.length - 1 });
      const randomUser = users[randomIndex];

      const priceValue = randNumber({ min: 1000, max: 500000 });
      const formattedPrice = `₩${priceValue.toLocaleString('ko-KR')}`;
      return prisma.item.create({
        data: {
          userId: randomUser.id,
          name: randProduct().title,
          description: randParagraph(),
          price: formattedPrice,
          tags: randText(),
        },
      });
    });

    await Promise.all(itemPromises);
  }

  for (const post of allPosts) {
    const commentCount = randNumber({ min: 1, max: 10 });
    const commentPromises = Array.from({ length: commentCount }).map(() => {
      const randomIndex = randNumber({ min: 0, max: users.length - 1 });
      const randomUser = users[randomIndex];

      return prisma.comment.create({
        data: {
          context: randText(),
          authorId: randomUser.id,
          articleId: post.id,
        },
      });
    });

    await Promise.all(commentPromises);
  }

  console.log(`${users.length}명의 유저가 생성되었습니다.`);
  console.log('데이터 시딩 완료');
}
main()
  .catch((e) => {
    console.error('Seeding Error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
