import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * 현재 로그인 사용자의 찜한 productId 목록을 서버 컴포넌트에서 바로 조회.
 * 비로그인이면 빈 배열. 카드 초기 하트 상태 깜박임 방지용.
 */
export async function getFavoriteProductIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user) return [];
  const rows = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { productId: true }
  });
  return rows.map((row) => row.productId);
}
