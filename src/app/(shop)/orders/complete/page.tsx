import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";

const ORDER_ITEMS = [
  {
    category: "프리미엄 채소",
    name: "[도깨비 직송] 무농약 유기농 케일 300g",
    qtyPrice: "1개 / 3,400원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLlemMHxI-70aeV0LT22N8UjgZtnx3ghubOBnWdc0MZcP9xaeYuyL3TUXLEh7_muirjHzJYi0ydIiWtljsYPFIhLv8I15Zo4EvXN0epp_XiWVqqzDjjAKVnJFrLNAdDzxDf1hqROdhoH3C72zeBRBtRVrtuPDufSrq56NRGxVmmBQzTxGCJlgOxK_GKkM4Fg0pUJMO37UubJID10LgR4dLeQSvDg22ve1zelBiqeS5MUXavGxAUrqrzv7vFSKVI5C7VdUlK2256o",
    alt: "Organic Kale"
  },
  {
    category: "고기 · 정육",
    name: "1등급 한우 채끝등심 구이용 200g",
    qtyPrice: "2개 / 58,000원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2Q_MOFJzqXKlQY4LKPm0dqME48tvWmjGD4878iqo-sr2aiXCkgkvncy1-BHnhWOH7JYecQmhbViW3H_fXHTuE2au6FY4Pdh1e5w5iN0iZKW-WaIpMX663ASzkEwCfU8S39A92Kxh7VjDZcE7CA3X25Y9HWzw9q-VIOkhH3s_5lWGdVC6WR65YyxU86NkYmJi0zWEwg4gkQbS1IRfjuRdhne7gBJzzxBeoYVdk5cVyLl3YpRlb-DhK_daOqPnipNQaqaCHxAVwWE",
    alt: "Premium Beef"
  }
];

const REORDER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCPulowX3TCw2NmScRts62LkFZ1EHzmfNwYFlfpb_51ZnUvFPIl7FwaJZjzEqAlbOG6rXsYVEa3fj6hKTGzH1sh_KDAjH9ZQZj4g-BcMFm1fS9ysGvufTAT9g50qv8EdP0jVSvCMzUl_2D07Av2f5RpCEwuV_fwkfDJGYkrD237SBG2IcRfnATWwEwfSbUJfnKVEMtG9k3bZogGYHtejLZvcLyBPAj98j2oCteyE81caKqpJ94RkJrCvPCjyQXm3pFInPP-bpgZ1UQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCjl-zorzFDA408GjiGMyKeL0_tr-emW07dJAJbNeh2bFJb96fBA9IQcZsDjn71ipIMS8GR_PA7EMCBAxeJmWz4pUprsJznejlEGSb0KKjrjsJ8N0gX13qPYon2aMGVnNoIjM_1P0g_DZojySDcWF3Z4LdvkUA9tWdXpLdL0l_1uUMaY23d3io9JMvx8hWWJFBmiK_PnQ2ff78wpxw15_FZcu-ACKqu71ErIE0WYijzCD2UbZ0tiM6_YTxuPwv7wkvE-2sV04aUulM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDbuW5fiKKomKXT6J5RB73ylV5r-7hRGngplo8cuBPsHBzkjfYTxCsOgRkk8UsZPYzp4Gva5clpbqq6g-Y46jqNpsul-aBXWneJJPMUH5nTlRScWJvxotmmm0dKqVMqO8yM8zhMtBoQCbtdlvpGqvzFq0XdQ8OCU8spMrJzt2zojOz8cG3zIp3V4QF_9EhoxQqIx2M2QLXJbpIL4QSiL6vW0IdHeOcbEpKcEVmgTn0n1V5tYUrQQ7h0GE0tcp3aQznMuGEtzsNVutY"
];

export default function OrderCompletePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col items-center justify-start px-4 pb-24 pt-12">
      {/* Success Confirmation */}
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl">
          <Icon name="check_circle" filled className="text-4xl text-white" />
        </div>
        <h1 className="mb-3 font-headline text-4xl font-extrabold tracking-tight text-primary">
          주문이 완료되었습니다
        </h1>
        <p className="text-lg text-on-surface-variant">
          도깨비와 함께 신선한 하루를 준비해 주셔서 감사합니다.
        </p>
      </div>

      {/* Order Info Bento Grid */}
      <div className="mb-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-8 shadow-sm">
          <div>
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              배송 안내
            </h2>
            <div className="mb-4 flex items-start gap-4">
              <Icon
                name="local_shipping"
                className="rounded-lg bg-surface-container-low p-2 text-primary"
              />
              <div>
                <p className="text-sm text-on-surface-variant">배송 예정일</p>
                <p className="text-xl font-bold text-on-surface">
                  내일 오전 7시 전 도착 예정
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-surface-container-low pt-6">
            <p className="mb-2 text-xs text-on-surface-variant">주문 번호</p>
            <p className="font-mono text-base font-bold tracking-wider">
              DKB-20231027-8892
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-primary-container p-8">
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon name="chat_bubble" className="text-3xl text-on-primary-container" />
              <h2 className="font-headline text-xl font-bold text-on-primary-container">
                카카오톡 알림톡
              </h2>
            </div>
            <p className="leading-relaxed text-on-primary-container">
              카카오톡으로 주문 내역과 상세 영수증이 발송되었습니다.
              <br />
              배송이 시작되면 다시 한번 안내해 드릴게요.
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Icon name="mark_chat_unread" className="text-9xl" />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-12 w-full rounded-xl bg-surface-container-low p-8">
        <h3 className="mb-6 font-headline text-xl font-bold text-on-surface">
          주문 상품 요약
        </h3>
        <div className="space-y-4">
          {ORDER_ITEMS.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-6 rounded-xl bg-surface-container-lowest p-4"
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="mb-1 text-xs font-medium text-on-surface-variant">
                  {item.category}
                </p>
                <h4 className="font-bold text-on-surface">{item.name}</h4>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {item.qtyPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-end justify-between border-t border-outline-variant/30 pt-6">
          <span className="text-on-surface-variant">최종 결제 금액</span>
          <div className="text-right">
            <span className="mr-2 text-sm text-on-surface-variant">총 2개 품목</span>
            <span className="text-3xl font-black text-primary">61,400원</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link
          href="/orders"
          className="flex items-center justify-center gap-2 rounded-md bg-surface-container-highest px-12 py-4 font-bold text-on-surface transition-all hover:bg-surface-variant active:scale-95"
        >
          주문 내역 보기
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-container px-12 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
        >
          쇼핑 계속하기
          <Icon name="arrow_forward" className="text-lg" />
        </Link>
      </div>

      {/* Floating Reorder Bar */}
      <div className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/20 bg-surface-bright/80 px-6 py-3 shadow-2xl backdrop-blur-2xl">
        <span className="text-xs font-bold uppercase tracking-tighter text-primary">
          최근 구매 품목 재주문
        </span>
        <div className="flex -space-x-2">
          {REORDER_IMAGES.map((src, idx) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt={`recent ${idx + 1}`}
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <Icon name="add_circle" className="cursor-pointer text-primary" />
      </div>
    </main>
  );
}
