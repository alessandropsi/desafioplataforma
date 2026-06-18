import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentHub — Copiloto financeiro preditivo para PMEs" },
      {
        name: "description",
        content:
          "Veja o futuro do caixa da sua empresa antes que ele aconteça. Copiloto financeiro com simulação da Reforma Tributária.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { aplicarPerfilPorNome } = useBusiness();
  const navigate = useNavigate();
  const [nome, setNomeLocal] = useState("");
  const [guia, setGuia] = useState(false);

  const podeEntrar = nome.trim().length >= 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!podeEntrar) return;
    aplicarPerfilPorNome(nome.trim());
    navigate({ to: "/onboarding" });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="eyebrow">Lovable demo</div>
        <h1 className="font-display mt-4 text-6xl text-foreground md:text-7xl">AgentHub</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Veja o futuro do caixa da sua empresa<br />antes que ele aconteça.
        </p>

        <form onSubmit={handleSubmit} className="mt-16 text-left">
          <label className="eyebrow block">Como você se chama?</label>
          <input
            autoFocus
            type="text"
            value={nome}
            onChange={(e) => setNomeLocal(e.target.value)}
            className="mt-3 w-full border-b border-divider bg-transparent py-3 font-display text-2xl text-foreground outline-none transition-colors focus:border-positive"
          />

          <button
            type="submit"
            disabled={!podeEntrar}
            className="mt-10 w-full rounded-md bg-positive px-6 py-3 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            Entrar
          </button>
        </form>

        <button
          type="button"
          onClick={() => setGuia(true)}
          className="mt-16 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Está avaliando este projeto? Veja como explorar →
        </button>
      </div>

      {guia && <GuiaModal onClose={() => setGuia(false)} />}
    </main>
  );
}

function GuiaModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg border border-divider bg-surface px-8 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
        <div className="eyebrow">Guia rápido</div>
        <h2 className="font-display mt-3 text-2xl text-foreground">Como explorar o AgentHub</h2>
        <ol className="mt-6 space-y-4 text-sm leading-relaxed text-foreground">
          {[
            "No Painel Preditivo, veja a projeção de 90 dias do caixa da empresa.",
            'Ative o botão "Simular Reforma Tributária (CBS/IBS)" e observe a curva se ajustar.',
            'Use os controles de "Simular Cenário" para testar hipóteses — o gráfico responde em tempo real.',
            'Acesse a aba "Modo WhatsApp" para ver como o agente responderia diretamente no WhatsApp do empreendedor.',
            'Acesse a aba "Plataforma AgentHub" para conhecer a visão de expansão para outros agentes financeiros.',
          ].map((t, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="eyebrow pt-1">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <button
          onClick={onClose}
          className="mt-8 border border-divider px-4 py-2 text-sm text-foreground hover:bg-background"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
