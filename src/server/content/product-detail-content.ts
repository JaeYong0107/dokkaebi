export const productDetailContent = {
  common: {
    seriesLabel: "[dokkaebi] 산지직송 시리즈",
    businessPriceHint: "로그인 후 사업자 가격과 혜택이 자동 반영됩니다",
    shippingCardLabel: "배송정보",
    shippingLeadLabel: "오전 10시 전 주문 시",
    shippingLeadHighlight: "오늘 출발",
    originCardLabel: "원산지",
    tabs: ["배송/교환/환불 정보", "상품 문의", "구매 리뷰"],
    policySections: [
      {
        title: "배송 안내",
        items: [
          "평일 오전 10시 이전 결제 완료 시 당일 발송이 가능합니다.",
          "신선식품 특성상 도서산간 지역은 배송이 제한될 수 있습니다.",
          "배송 상태는 주문 상세와 배송 조회 화면에서 확인할 수 있습니다."
        ]
      },
      {
        title: "교환 및 반품 안내",
        items: [
          "신선식품은 단순 변심에 의한 교환 및 반품이 제한됩니다.",
          "상품 파손 또는 품질 이슈는 수령 직후 고객센터로 접수해 주세요.",
          "문제 확인 시 재발송 또는 환불 정책이 적용됩니다."
        ]
      }
    ],
    recommendationTitle: "함께 사면 좋은 상품",
    quickReorderLabel: "Quick Reorder",
    quickReorderDescription: "최근 구매한 상품을 빠르게 담으세요",
    quickReorderActionLabel: "장바구니 전체 담기",
    sections: {
      origin: "산지 직송 정보",
      metrics: "상품 지표",
      nutrition: "영양 정보 (100g 당)"
    }
  },
  overrides: {
    "prod-lettuce-001": {
      metrics: [
        { label: "수분 함량", value: "95%", percent: 95 },
        { label: "조직감", value: "우수", percent: 88 },
        { label: "당도(Brix)", value: "4.2", percent: 45 }
      ],
      nutrition: [
        { label: "열량", value: "15 kcal" },
        { label: "식이섬유", value: "1.5g" },
        { label: "비타민C", value: "25mg" },
        { label: "칼슘", value: "32mg" }
      ]
    },
    default: {
      metrics: [
        { label: "신선도", value: "상", percent: 90 },
        { label: "재구매율", value: "87%", percent: 87 },
        { label: "규격 안정성", value: "우수", percent: 82 }
      ],
      nutrition: [
        { label: "열량", value: "42 kcal" },
        { label: "탄수화물", value: "9.8g" },
        { label: "비타민A", value: "18%" },
        { label: "칼륨", value: "320mg" }
      ]
    }
  }
} as const;
