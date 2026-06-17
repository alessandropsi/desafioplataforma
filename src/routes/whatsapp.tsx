import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { calcularProjecao, useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "Modo WhatsApp · Rumo" },
      {
        name: "description",
        content: "Veja como o copiloto Rumo responde diretamente no WhatsApp do empreendedor.",
      },
    ],
  }),
  component: WhatsAppMode,
});

type Msg = { from: "user" | "rumo"; text: string };

function WhatsAppMode() {
  const { data } = useBusiness();
  const projecao = calcularProjecao(data, { reducaoFaturamento: 0, atrasoFornecedor: 0, comReforma: false });
  const negativa = projecao.find((p) => p.saldo < 0);
  const dataRisco = negativa ? negativa.data : "fim do mês";

  const script: Msg[] = [
    { from: "user", text: "Rumo, como tá meu caixa esse mês?" },
    {
      from: "rumo",
      text: `Seu saldo atual é R$ ${data.saldo.toLocaleString("pt-BR")}. Na taxa atual de gastos, você deve ficar negativo na semana de ${dataRisco}. Quer que eu simule um jeito de evitar isso?`,
    },
    { from: "user", text: "Quero sim" },
    {
      from: "rumo",
      text: "Se você atrasar o pagamento do fornecedor principal em 6 dias, seu caixa fica positivo até o fim do mês. Posso te lembrar disso na quinta-feira?",
    },
    { from: "user", text: "Pode. E essa reforma tributária vai afetar meu preço?" },
    {
      from: "rumo",
      text: "Vai sim. Com a CBS e o IBS entrando em vigor, sua margem aperta gradualmente a partir de abril. Recomendo revisar seu preço em até 60 dias. Quer que eu te mostre a simulação completa?",
    },
  ];

  const [visible, setVisible] = useState<number>(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= script.length) return;
    const next = script[visible];
    const delay = next.from === "rumo" ? 900 : 500;
    const t = setTimeout(() => {
      if (next.from === "rumo") {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setVisible((v) => v + 1);
        }, 1100);
      } else {
        setVisible((v) => v + 1);
      }
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visible, typing]);

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="eyebrow">Demonstração</div>
        <h1 className="font-display mt-3 text-3xl text-foreground md:text-4xl">
          Onde o empreendedor já está.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Em produção, o Rumo responde no próprio WhatsApp — sem aplicativo novo, sem painel para
          aprender.
        </p>

        <div className="mt-12 flex flex-col items-center">
          {/* Phone container */}
          <div className="w-full max-w-[390px] overflow-hidden rounded-[28px] border border-divider bg-[#E5DDD5]">
            {/* Top bar */}
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#128C7E] font-display text-base">
                R
              </div>
              <div>
                <div className="text-sm font-medium leading-tight" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Rumo
                </div>
                <div className="text-[11px] opacity-80" style={{ fontFamily: "system-ui, sans-serif" }}>
                  online
                </div>
              </div>
            </div>

            {/* Chat */}
            <div
              ref={scrollRef}
              className="h-[480px] space-y-2 overflow-y-auto px-3 py-4"
              style={{
                fontFamily: "system-ui, sans-serif",
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(0,0,0,0.03) 0 1px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.03) 0 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {script.slice(0, visible).map((m, i) => (
                <Bubble key={i} from={m.from}>
                  {m.text}
                </Bubble>
              ))}
              {typing && (
                <Bubble from="rumo">
                  <span className="inline-flex gap-1">
                    <Dot delay={0} />
                    <Dot delay={150} />
                    <Dot delay={300} />
                  </span>
                </Bubble>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-black/10 bg-[#F0F0F0] px-3 py-2">
              <div className="flex-1 rounded-full bg-white px-4 py-2 text-xs text-gray-400" style={{ fontFamily: "system-ui" }}>
                Digite uma mensagem
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#128C7E] text-white">
                ➤
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
            Simulação da experiência via WhatsApp Business API — em produção, o Rumo responde
            diretamente no seu WhatsApp, sem precisar abrir nenhum aplicativo novo.
          </p>
        </div>
      </main>
    </div>
  );
}

function Bubble({ from, children }: { from: "user" | "rumo"; children: React.ReactNode }) {
  const isUser = from === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div
        className={
          "max-w-[80%] rounded-lg px-3 py-2 text-[13.5px] leading-snug text-gray-900 shadow-sm " +
          (isUser ? "bg-[#DCF8C6]" : "bg-white")
        }
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
