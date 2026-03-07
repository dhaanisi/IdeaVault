import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  readonly params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  return {};
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  return [];
};

export default async function LegalPage(_: PageProps) {
  notFound();
}