"use client";

import { useState } from "react";
import { Icon } from "@/shared/ui/Icon";

type PolicySection = {
  title: string;
  items: string[];
};

type Props = {
  tabs: readonly string[];
  policySections: readonly PolicySection[];
};

export function ProductDetailTabs({
  tabs,
  policySections
}: Readonly<Props>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mt-20">
      <div
        role="tablist"
        aria-label="상품 정보"
        className="mb-8 flex border-b border-surface-container-highest"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`product-detail-tab-${index}`}
              id={`product-detail-tab-button-${index}`}
              onClick={() => setActiveIndex(index)}
              className={
                isActive
                  ? "border-b-2 border-primary px-8 py-4 font-bold text-primary"
                  : "px-8 py-4 text-on-surface-variant transition-colors hover:text-on-surface"
              }
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`product-detail-tab-${activeIndex}`}
        aria-labelledby={`product-detail-tab-button-${activeIndex}`}
        className="space-y-8 rounded-3xl bg-white p-10 text-on-surface-variant"
      >
        {activeIndex === 0 && (
          <>
            {policySections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 font-bold text-on-surface">
                  {section.title}
                </h4>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {activeIndex === 1 && (
          <PlaceholderPanel
            icon="forum"
            title="상품 문의"
            description="이 상품에 대해 사장님들이 남긴 문의와 답변을 보여드리는 공간이에요."
            note="문의 기능은 곧 오픈 예정입니다. 급한 문의는 고객센터로 연락해 주세요."
          />
        )}

        {activeIndex === 2 && (
          <PlaceholderPanel
            icon="rate_review"
            title="구매 리뷰"
            description="실제 구매 고객의 사용 후기와 별점이 표시될 영역이에요."
            note="첫 리뷰는 구매 완료 후 마이페이지 주문 내역에서 작성할 수 있게 준비 중입니다."
          />
        )}
      </div>
    </div>
  );
}

function PlaceholderPanel({
  icon,
  title,
  description,
  note
}: Readonly<{
  icon: string;
  title: string;
  description: string;
  note: string;
}>) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name={icon} className="text-2xl" />
      </div>
      <p className="font-bold text-on-surface">{title}</p>
      <p className="text-sm">{description}</p>
      <p className="text-xs text-on-surface-variant/70">{note}</p>
    </div>
  );
}
