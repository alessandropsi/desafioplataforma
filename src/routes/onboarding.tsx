import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { mascaraCNPJ, useBusiness, validarCNPJ } from "@/lib/business-context";


export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "AgentHub — Confirme os dados do seu negócio" },
      {
        name: "description",
        content:
          "Confirme os dados do seu negócio para projetarmos seu saldo nos próximos 90 dias.",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { data, setData, nome } = useBusiness();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">{nome ? `Olá, ${nome}` : "AgentHub"} · Onboarding</div>
        <h1 className="font-display mt-4 text-4xl leading-[1.05] text-foreground md:text-5xl">
          Confirme os dados do seu negócio.
        </h1>
        <p className="mt-5 max-w-xl text-sm text-muted-foreground">
          Já preenchemos um perfil para você. Ajuste qualquer valor ou siga direto para a projeção.
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

          <Field label="CNPJ">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <input
                type="text"
                inputMode="numeric"
                value={data.cnpj}
                onChange={(e) => setData({ ...data, cnpj: mascaraCNPJ(e.target.value) })}
                placeholder="00.000.000/0000-00"
                className="tabular w-full bg-transparent text-lg text-foreground outline-none"
              />
              {data.cnpj && (
                validarCNPJ(data.cnpj) ? (
                  <span className="text-xs text-positive">✓ CNPJ válido</span>
                ) : (
                  <span className="text-xs text-muted-foreground">CNPJ inválido</span>
                )
              )}
            </div>
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
              Conheça a plataforma AgentHub →
            </Link>
            <button
              type="submit"
              className="rounded-md bg-positive px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
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
