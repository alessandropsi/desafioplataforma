import { createContext, useContext, useState, type ReactNode } from "react";

export type BusinessData = {
  empresa: string;
  setor: string;
  regime: string;
  faturamento: number;
  contas: number;
  saldo: number;
};

export const PERFIS: BusinessData[] = [
  {
    empresa: "Loja Estação Norte",
    setor: "Comércio/Varejo",
    regime: "Simples Nacional",
    faturamento: 45000,
    contas: 32000,
    saldo: 18000,
  },
  {
    empresa: "Espaço Bela Vista",
    setor: "Serviços",
    regime: "Simples Nacional",
    faturamento: 28000,
    contas: 19000,
    saldo: 22000,
  },
  {
    empresa: "Ferragens Lopes",
    setor: "Comércio/Varejo",
    regime: "Lucro Presumido",
    faturamento: 62000,
    contas: 48000,
    saldo: 12000,
  },
];

export function perfilParaNome(nome: string): number {
  const limpo = nome.trim().toLowerCase();
  if (!limpo) return 0;
  let soma = 0;
  for (let i = 0; i < limpo.length; i++) soma += limpo.charCodeAt(i);
  return soma % 3;
}

type Ctx = {
  nome: string;
  setNome: (n: string) => void;
  data: BusinessData;
  setData: (d: BusinessData) => void;
  aplicarPerfilPorNome: (nome: string) => void;
};

const BusinessCtx = createContext<Ctx | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [nome, setNome] = useState<string>("");
  const [data, setData] = useState<BusinessData>(PERFIS[0]);

  const aplicarPerfilPorNome = (n: string) => {
    setNome(n);
    setData(PERFIS[perfilParaNome(n)]);
  };

  return (
    <BusinessCtx.Provider value={{ nome, setNome, data, setData, aplicarPerfilPorNome }}>
      {children}
    </BusinessCtx.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessCtx);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Projecao = {
  semana: number;
  data: string;
  saldo: number;
  saldoReforma?: number;
};

export type Cenario = {
  reducaoFaturamento: number;
  atrasoFornecedor: number;
  comReforma: boolean;
};

const REFORMA_PCT = [
  0.005, 0.005, 0.005, 0.005,
  0.012, 0.012, 0.012, 0.012,
  0.021, 0.021, 0.021, 0.021,
];

export function calcularProjecao(d: BusinessData, c: Cenario): Projecao[] {
  const rng = mulberry32(42);
  const entradaBase = d.faturamento / 4.3;
  const saidaBase = d.contas / 4.3;
  const fatorReducao = 1 - c.reducaoFaturamento;
  const semanaAtraso = Math.min(11, Math.floor(c.atrasoFornecedor / 7));
  const resultado: Projecao[] = [];
  let saldo = d.saldo;
  let saldoReforma = d.saldo;
  const hoje = new Date();

  for (let i = 0; i < 12; i++) {
    const ruido = 1 + (rng() - 0.5) * 0.16;
    const entradaSemana = entradaBase * ruido * fatorReducao;

    let saidaSemana = saidaBase;
    if (c.atrasoFornecedor > 0) {
      if (i === semanaAtraso) saidaSemana = saidaBase * 0.6;
      else if (i === semanaAtraso + 1) saidaSemana = saidaBase * 1.4;
    }

    saldo = saldo + entradaSemana - saidaSemana;

    const reformaExtra = (d.faturamento / 4.3) * fatorReducao * REFORMA_PCT[i];
    saldoReforma = saldoReforma + entradaSemana - saidaSemana - reformaExtra;

    const dataSemana = new Date(hoje);
    dataSemana.setDate(hoje.getDate() + (i + 1) * 7);

    resultado.push({
      semana: i + 1,
      data: dataSemana.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      saldo: Math.round(saldo),
      saldoReforma: c.comReforma ? Math.round(saldoReforma) : undefined,
    });
  }
  return resultado;
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
