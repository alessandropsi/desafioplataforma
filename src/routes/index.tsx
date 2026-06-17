import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rumo — Comece sua projeção de caixa" },
      {
        name: "description",
        content:
          "Informe os dados do seu negócio em segundos e veja a projeção de caixa para os próximos 90 dias.",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { data, setData } = useBusiness();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">Rumo · Copiloto financeiro</div>
        <h1 className="font-display mt-4 text-5xl leading-[1.05] text-foreground md:text-6xl">
          Veja o futuro do seu caixa<br />
          <span className="text-muted-foreground">antes que ele aconteça.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          Informe alguns dados do seu negócio para projetarmos seu saldo nos próximos 90 dias e
          identificar pontos de risco antes que se tornem um problema.
        </p>

        <form
          className="mt-12 border-t border-divider"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/painel" });
          }}
        >
          <Field label="Nome da empresa">
            <input
              type="text"
              value={data.empresa}
              onChange={(e) => setData({ ...data, empresa: e.target.value })}
              className="w-full bg-transparent text-lg text-foreground outline-none"
            />
          </Field>

          <Field label="Setor">
            <select
              value={data.setor}
              onChange={(e) => setData({ ...data, setor: e.target.value })}
              className="w-full bg-transparent text-lg text-foreground outline-none"
            >
              <option className="bg-surface">Comércio/Varejo</option>
              <option className="bg-surface">Serviços</option>
              <option className="bg-surface">Indústria</option>
            </select>
          </Field>

          <Field label="Regime tributário">
            <select
              value={data.regime}
              onChange={(e) => setData({ ...data, regime: e.target.value })}
              className="w-full bg-transparent text-lg text-foreground outline-none"
            >
              <option className="bg-surface">Simples Nacional</option>
              <option className="bg-surface">Lucro Presumido</option>
            </select>
          </Field>

          <NumField
            label="Faturamento médio mensal (R$)"
            value={data.faturamento}
            onChange={(v) => setData({ ...data, faturamento: v })}
          />
          <NumField
            label="Contas a pagar recorrentes (R$/mês)"
            value={data.contas}
            onChange={(v) => setData({ ...data, contas: v })}
          />
          <NumField
            label="Saldo em caixa atual (R$)"
            value={data.saldo}
            onChange={(v) => setData({ ...data, saldo: v })}
          />

          <div className="flex items-center justify-between border-t border-divider py-8">
            <Link to="/plataforma" className="text-sm text-muted-foreground hover:text-foreground">
              Conheça a plataforma Rumo →
            </Link>
            <button
              type="submit"
              className="border border-foreground bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-transparent hover:text-foreground"
            >
              Ver minha projeção →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-2 border-b border-divider py-6 md:grid-cols-[260px_1fr] md:items-center md:gap-8">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="tabular w-full bg-transparent text-lg text-foreground outline-none"
      />
    </Field>
  );
}
