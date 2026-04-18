import Link from "next/link";
import { Icon } from "@/components/common/Icon";

const THUMBNAIL_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD641zzoBu6pVm1rVHBCkWDkbwtFCmKh3-yuJjM3RY_g16cVwqv9RO_LkEF_eKW_J-Oj_3cWrbFh4aEmSYzPoT4Ek3iKnClJdVpQycFWo7PJSApHQh4qRIa9QHJKCltrz84TKDTHgyPKDn1QgBp1p1MP8iXg3nVp0PZnvpGpAgqGGxE1Aq65b3QSPkh4Egmi81Xiv2BvcnEQHU3oqzkcGDmwWieMB4P8CScF3H7AQ0ot8XqC9SkI4QQeBPODgg9iLJsr6uA-3cS_pc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUMzjgSEeWBHKWshX_LtQR24ggRHWXmpIYO8viTk98_brspqsJlTFglua75KXZGWBCsrlzWxJ_fzOgF04fwwMjMrrJew6FU5S1QkVqmTYdFNmGju581_SJBN1CV6joeiIScEd8Iw-QRaPMI15_wKQC48KtsHt9yloGS0KysM6Fdok7HwMsQLbw46BosT2bdkjQ5oRxJ_Z6JXqkOHtPwm-Rwvt39pp0eZe2YtuO2cQIiPfKx1Sl1xRpWWlCknFj6xP4-rt1bkJ8S7M",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCj7c1TIGwj4CQatCHHpxqAsPv1xbKEQhXDFw3iyVkkeHDuelF4rPkpHUYB_Oqyhvmbh_KBiSszQmgpFqEchVrywqZ4b9Phdg6Ky-VOwH86faWr8IT21WE1IXwt5u-wYhVwXPcndi_EDk7y43WtHs8LXDLyQxCQswQoRjYKbOIZL84sz4TURdXLbrF8Dv4TYY8_HG7hCWykyDil8y0iyHw1uXIeBmI29N3OfJsQWabo-FPULSEcIxv3oYQetW5wGUgYgkKbz5SOATs"
];

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBZdgxf1LlisLPITLUZ023MP1knlJ2l2k8Y72l7Y7uFYVS6t-tXORQ0hfBpDZVn5BexlRAAJB9tu3kW7LC5oj_kI8AOLdwSVp3v-BBuPspIzdS2S5A5q-I0CHx0CkiNVwLfyTlvKUnb5c55JDQd4FXclCYjfYuwv2MZT0yXyBAOCOBsPcppEy5czar9lAs8syiwcImcv8Zwk7d47ZAzsJgG_mIuEAA-we5Me42bEXF61m9KoAQ7aWgaMx_-sAnixIwhgjwjdKnwqk4";

const FARM_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAdNQjgoz99EmoAtDm556Hrsm6SG3aeZYOjQkSNpwHvV5W8LO1UBmXbS3ODKuzfC1du6wEldeiWuetvGlS6tQP0OF5W-XGSE2uoopZSuy8B8ZDG6mNjSWyycdIyxexMKKLrWB9m3reUacSX25qDH6N93YOn6TGfnhL4i30-wBKbbJg5K3E36BdAqc5hVDADIPxMhckpcuXhyJFkgmJK-jEUNorT0lHnFRKGgAgwYdgT86zcas54wjnk-3gpf-0sLQJHDEOqqFKhfJQ";

const RECOMMENDATIONS = [
  {
    name: "무농약 대추방울토마토 500g",
    price: "5,800원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Zjf_rnd0K3rgO9NwqE_7QPsHy7y0X0yPkVyJl55iJulCu2CdOhHBxDd0on8aeJv-fJF4LqiVQTg9mZ1RpTUQa6ziplxU1CbNRKMt6c8AeJEAMi7FILseXzTxX3rpdMcO-VQEwi0mAobFawq-Ol1IoKOhZUt1jHkC-8lbCe1KflQSw5sg_6n30TmaDv-TKokRPAb6aTIfJ_jM-W3kJR52__ersv83MVQ0OUa1X8Ig0uCAejOKUoAI27dbZmgffhhxqz9vrHy8X_I",
    alt: "Cherry tomatoes"
  },
  {
    name: "수제 오리엔탈 드레싱 250ml",
    price: "4,200원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2IEOw8zPyy0OMjfImqmqdtg3vF8TcBV9m0bvmReE3WzLCeMOg43z4g3dZNixWjpv1bcbqYw2lhMGvosEDM2mDR9WwH1Pp7IvUmqx-JTE2_bSl2BgBHvpk1HHboAAnh66T5q_Bz1ZmeWMLElKy6CM24OqPlBBrNNAC-iSethSa-Lax8cv05I2UCFgbGipTq8_6o8H6DIgF1m3x494QHTc3hJ8tqDHMxmci97ocn9Dxz1_wrR7NEGkg1g8DJh-vsh4QTCzelOHlbDU",
    alt: "Salad dressing"
  },
  {
    name: "샐러드용 견과 믹스 10팩",
    price: "8,900원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZtHpfjKR7tOdfNTLKpTf4RQ0cZWwx6XDv69iCQB5Cj0iu8iflsGclXjJQa2iaM6A9K9iYp2R-dN7XDHS1sI8JrqjClYD_l-j7Oe5PqkHBa_UElEzR-WxPCBodE59w6JhQyfWojglxWjLnxdQLCMOiiCW-hkHKNSwAeClSCfW8PhDTuPxOxhHEszKs7V78LlvVZSEPsmhJwUWSVd93FDwPKvwTjmZd2KdosVs_jNxhtgZABO_PhuLosWOTP59svMmEcpqQCDr9Zww",
    alt: "Mixed nuts"
  }
];

const QUICK_REORDER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAALdUyXs6Mbd1tJw7MUpAF-CNaNgUJrSvSEOKbXa885UXstdkt5tpz4tPzh-jcVwbagiXBIEG1utQ6cBtMkJ3WtJ6FcNMDaNkkT4b7ds3Dyo_vMA2xSOeXKtH90oilupZ-lJX5zDLRxFmamGmWzXizARRZxeXax4LXd1VgUKR2yXEJvvxs3L-t_JdRPlVQyn8uKs13muhlBQcX68ryMkCNeBVbE944bTNRuM3JAkA8Ye97lURINQO_Zt4pZn1B3K3J_yaFefb9LsU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD3QEEYeQmprGqHkjhmqTbeoT8ayO8fnvRXEGYAFck_W1pkbxA6gYJCCV4SZ5Gv2GSmC2E_O_8vsT8hAoFXDGeqaYpmW_0icOL_OqbLBgOTcczQlDSsj3R67TJfGCR9bJs1m_YI72mbmj41jGMp62Q0h47_xWVMKjijwzQKLbLrber_Xuk9B7RXR-DKosE3cgdq_dWANW4NfVJqm5pBxrlzha31d3ZTBNWEhMmU2BBA7glQTdnb3hSeP-TilnZBcJ3L2o9Vw3-Zxus"
];

export default function ProductDetailPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary">홈</Link>
        <Icon name="chevron_right" className="text-xs" />
        <Link href="/products" className="hover:text-primary">채소</Link>
        <Icon name="chevron_right" className="text-xs" />
        <span className="font-bold text-primary">버터헤드 레터스</span>
      </nav>

      {/* Product Hero Section (Asymmetric Layout) */}
      <div className="mb-20 grid grid-cols-12 gap-12">
        {/* Product Gallery */}
        <div className="col-span-12 flex gap-4 lg:col-span-7">
          <div className="flex flex-col gap-4">
            {THUMBNAIL_IMAGES.map((src, idx) => (
              <div
                key={src}
                className={
                  "h-20 w-20 cursor-pointer overflow-hidden rounded-xl bg-surface-container-high transition-all hover:ring-2 ring-primary" +
                  (idx === 0 ? " ring-2" : "")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`thumb ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="group relative flex-1 overflow-hidden rounded-[2rem] bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="버터헤드 레터스"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute left-6 top-6 flex flex-col gap-2">
              <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                산지직송
              </span>
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                무농약 인증
              </span>
            </div>
          </div>
        </div>

        {/* Product Purchase Actions */}
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <div className="mb-2 text-sm font-bold tracking-widest text-primary">
            [dokkaebi] 산지직송 시리즈
          </div>
          <h1 className="mb-6 text-4xl font-black leading-tight text-on-surface">
            무농약 버터헤드 레터스 1kg <br />
            <span className="text-2xl font-medium text-on-surface-variant">
              신선함 그대로 담았습니다
            </span>
          </h1>
          <div className="mb-8 rounded-2xl border-l-4 border-primary bg-surface-container-low p-6">
            <div className="mb-4 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-on-surface-variant">
                  일반 판매가
                </span>
                <span className="text-lg text-on-surface-variant line-through">
                  18,500원
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">
                    사업자 22% 할인
                  </span>
                </div>
                <span className="text-4xl font-black text-primary">
                  14,430<span className="text-xl">원</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Icon name="info" className="text-sm" />
              로그인 후 사업자 전용 추가 혜택을 확인하세요
            </div>
          </div>

          {/* Bento Grid Style Info */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">배송정보</div>
              <div className="text-sm font-bold">
                오전 10시 전 주문 시 <br />
                <span className="text-primary">오늘 출발</span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">원산지</div>
              <div className="text-sm font-bold">
                경상북도 청도군 <br />
                덕산 농장
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <div className="mb-4 text-sm font-bold">수량 선택</div>
            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-outline-variant bg-white">
              <button className="px-4 py-3 text-primary hover:bg-surface-container-low">
                <Icon name="remove" />
              </button>
              <input
                type="number"
                defaultValue={1}
                className="w-12 border-none text-center text-lg font-bold focus:ring-0"
              />
              <button className="px-4 py-3 text-primary hover:bg-surface-container-low">
                <Icon name="add" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary py-4 font-bold text-primary transition-colors hover:bg-surface-container-low">
              <Icon name="shopping_cart" /> 장바구니
            </button>
            <Link
              href="/checkout"
              className="flex flex-[2] items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg shadow-primary/10 transition-all hover:opacity-90"
            >
              바로 구매하기
            </Link>
          </div>
        </div>
      </div>

      {/* Detail Tabs & Content */}
      <div className="mt-12 grid grid-cols-12 gap-12 border-t-2 border-surface-container pt-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-12">
            <section>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                  01
                </span>
                산지 직송 정보
              </h2>
              <div className="group relative h-96 overflow-hidden rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FARM_IMAGE}
                  alt="덕산 농장"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="mb-2 text-sm text-white/80">
                    경상북도 청도군 덕산길 124
                  </div>
                  <div className="text-3xl font-bold text-white">
                    덕산 농장 : 이영수 농부
                  </div>
                  <p className="mt-4 max-w-md text-white/70">
                    "우리 가족이 먹는다는 마음으로 30년째 무농약 수경재배를 고집하고 있습니다. 가장 신선할 때 따서 바로 보내드립니다."
                  </p>
                </div>
              </div>
            </section>
            <section className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                    02
                  </span>
                  신선도 데이터
                </h2>
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <div className="space-y-6">
                    {[
                      { label: "수분 함량", value: "95%", percent: 95 },
                      { label: "조직감", value: "우수", percent: 88 },
                      { label: "당도(Brix)", value: "4.2", percent: 45 }
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between">
                        <span className="font-medium text-on-surface-variant">
                          {m.label}
                        </span>
                        <div className="mx-4 h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${m.percent}%` }}
                          />
                        </div>
                        <span className="font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                    03
                  </span>
                  영양 정보 (100g 당)
                </h2>
                <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-surface-container-low p-8">
                  {[
                    { label: "열량", value: "15 kcal" },
                    { label: "식이섬유", value: "1.5g" },
                    { label: "비타민C", value: "25mg" },
                    { label: "칼슘", value: "32mg" }
                  ].map((n) => (
                    <div key={n.label} className="text-center">
                      <div className="text-xl font-bold text-primary">{n.value}</div>
                      <div className="text-xs text-on-surface-variant">{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Policy Tabs */}
          <div className="mt-20">
            <div className="mb-8 flex border-b border-surface-container-highest">
              <button className="border-b-2 border-primary px-8 py-4 font-bold text-primary">
                배송/교환/환불 정보
              </button>
              <button className="px-8 py-4 text-on-surface-variant hover:text-on-surface">
                상품 문의 (24)
              </button>
              <button className="px-8 py-4 text-on-surface-variant hover:text-on-surface">
                구매 리뷰 (158)
              </button>
            </div>
            <div className="space-y-8 rounded-3xl bg-white p-10 text-on-surface-variant">
              <div>
                <h4 className="mb-4 font-bold text-on-surface">배송 안내</h4>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>평일 오전 10시 이전 결제 완료 시 당일 수확 및 발송됩니다.</li>
                  <li>신선식품 특성상 제주 및 도서산간 지역은 배송이 제한될 수 있습니다.</li>
                  <li>롯데택배를 통해 안전하게 배송됩니다.</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-on-surface">교환 및 반품 안내</h4>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>신선식품은 단순 변심에 의한 교환 및 반품이 불가합니다.</li>
                  <li>상품 파손 또는 품질 문제가 있을 경우, 수령 직후 사진 촬영과 함께 고객센터로 문의주세요.</li>
                  <li>수령 후 24시간 이내 접수된 건에 한하여 100% 재발송 또는 환불 처리해드립니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Recommendation */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="rounded-3xl bg-primary/5 p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                함께 사면 좋은 상품
                <Icon name="auto_awesome" className="text-sm text-primary" />
              </h3>
              <div className="space-y-6">
                {RECOMMENDATIONS.map((rec) => (
                  <div key={rec.name} className="group flex cursor-pointer gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rec.img}
                        alt={rec.alt}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-bold transition-colors group-hover:text-primary">
                        {rec.name}
                      </div>
                      <div className="font-bold text-primary">{rec.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Reorder Bar */}
      <div className="fixed bottom-8 left-1/2 z-40 flex w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-[2rem] border border-white/20 bg-white/80 px-8 py-4 shadow-[0_-8px_32px_rgba(0,76,22,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="border-r border-surface-container-highest pr-6 text-xs font-black uppercase tracking-tighter text-primary">
            Quick Reorder
          </div>
          <div className="flex gap-2">
            {QUICK_REORDER_IMAGES.map((src, idx) => (
              <div
                key={src}
                className="h-10 w-10 overflow-hidden rounded-full bg-surface-container ring-2 ring-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`recent ${idx + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            최근 구매한 상품을 빠르게 담으세요
          </div>
        </div>
        <button className="rounded-full bg-secondary-container px-8 py-3 text-sm font-bold text-on-secondary-container shadow-lg shadow-secondary-container/20 transition-transform hover:scale-105">
          장바구니 전체 담기
        </button>
      </div>
    </main>
  );
}
