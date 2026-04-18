import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2">
          <span className="mb-6 block font-headline text-xl font-black tracking-tighter text-stone-400">
            dokkaebi
          </span>
          <p className="max-w-md text-sm leading-relaxed text-stone-500">
            (주)도깨비 | 대표자: 홍길동 | 서울특별시 강남구 테헤란로 123 도깨비빌딩 4층
            <br />
            사업자등록번호: 123-45-67890 | 통신판매업신고: 2023-서울강남-0000
            <br />
            고객센터: 1588-0000 (평일 09:00 - 18:00)
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-bold">서비스</h4>
          <ul className="space-y-2 text-sm text-stone-500">
            <li><Link href="#" className="hover:text-primary">이용약관</Link></li>
            <li><Link href="#" className="font-bold text-stone-700 hover:text-primary">개인정보처리방침</Link></li>
            <li><Link href="#" className="hover:text-primary">배송안내</Link></li>
            <li><Link href="#" className="hover:text-primary">고객센터</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold">비즈니스</h4>
          <ul className="space-y-2 text-sm text-stone-500">
            <li><Link href="#" className="hover:text-primary">입점문의</Link></li>
            <li><Link href="#" className="hover:text-primary">광고제휴</Link></li>
            <li><Link href="#" className="hover:text-primary">대량구매상담</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-stone-200 px-6 pt-8 text-center text-[10px] text-stone-400">
        COPYRIGHT © DOKKAEBI. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
