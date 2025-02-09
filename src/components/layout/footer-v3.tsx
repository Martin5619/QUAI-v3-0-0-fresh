"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Icons } from "@/components/icons"

export default function Footer() {
  const t = useTranslations("common")

  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">QUAi</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{t("footer.product.title")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.product.features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.product.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.product.about")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">{t("footer.support.title")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.support.documentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.support.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">{t("footer.legal.title")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.legal.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("footer.legal.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
