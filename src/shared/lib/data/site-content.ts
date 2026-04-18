import siteContentData from "../../../../data/site-content.json";

export type SiteContent = typeof siteContentData;

export const siteContent = siteContentData as SiteContent;
