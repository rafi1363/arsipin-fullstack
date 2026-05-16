import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex items-center justify-between py-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Arsipin
          </p>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Masuk
          </Link>
        </nav>
      </Container>
    </header>
  );
}

function StatsCard() {
  return (
    <Card className="p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Total dokumen</p>
            <p className="mt-2 text-3xl font-semibold sm:text-4xl">128</p>
          </div>
          <Badge>Demo UI</Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs text-muted">Aktif</p>
            <p className="mt-2 text-xl font-semibold">96</p>
          </div>
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs text-muted">Segera habis</p>
            <p className="mt-2 text-xl font-semibold text-accent">21</p>
          </div>
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs text-muted">Kedaluwarsa</p>
            <p className="mt-2 text-xl font-semibold text-danger">11</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </Card>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <Container className="py-8 sm:py-10 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Arsipin
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Manajemen arsip yang rapi dan tenang.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Arsipin membantu Anda menyimpan metadata dokumen, memantau masa
              berlaku, dan menyiapkan dashboard arsip tanpa antarmuka yang
              berisik.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/login">Mulai Sekarang</Button>
              <Button href="#fitur" variant="secondary">
                Lihat Ringkasan
              </Button>
            </div>
          </div>

          <div className="w-full">
            <StatsCard />
          </div>
        </section>

        <section
          id="fitur"
          className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            title="Dokumen tertata"
            description="Simpan metadata dokumen dengan struktur yang jelas dan mudah dicari."
          />
          <FeatureCard
            title="Pantau masa berlaku"
            description="Lihat status aktif, segera habis, dan kedaluwarsa dalam satu alur."
          />
          <FeatureCard
            title="Siap jadi dashboard"
            description="Fondasi backend sudah siap untuk dihubungkan ke UI login dan dashboard."
          />
        </section>
      </Container>
    </main>
  );
}
