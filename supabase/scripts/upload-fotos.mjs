// =============================================================
//  UPLOAD DE FOTOS — Casa de Carnes Maciel
//  Sobe as fotos de supabase/scripts/lista-fotos.json para o Storage
//  e grava o link em cada produto (imagem_url).
//
//  COMO RODAR (no terminal, dentro da pasta do projeto):
//    node supabase/scripts/upload-fotos.mjs
//
//  Vai pedir o e-mail e a senha do painel (/painel). Não fica salvo
//  em lugar nenhum, só é usado na hora para logar no Supabase.
// =============================================================

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function lerEnv() {
  // .env fica na raiz do projeto (dois níveis acima de supabase/scripts)
  const raizProjeto = path.resolve(__dirname, "..", "..");
  return readFile(path.join(raizProjeto, ".env"), "utf8").then((texto) => {
    const vars = {};
    for (const linha of texto.split(/\r?\n/)) {
      const m = linha.match(/^([A-Z_]+)\s*=\s*(.*)$/);
      if (m) vars[m[1]] = m[2].trim();
    }
    return vars;
  });
}

function perguntar(pergunta, { esconder = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    if (!esconder) {
      rl.question(pergunta, (resp) => {
        rl.close();
        resolve(resp.trim());
      });
      return;
    }
    // esconde a digitação da senha no terminal
    const outputOriginal = rl._writeToOutput;
    rl._writeToOutput = function (str) {
      if (str.includes(pergunta)) outputOriginal.call(rl, str);
      else outputOriginal.call(rl, "*");
    };
    rl.question(pergunta, (resp) => {
      rl.close();
      process.stdout.write("\n");
      resolve(resp.trim());
    });
  });
}

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

async function main() {
  const env = await lerEnv();
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error("Não achei VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no .env da raiz do projeto.");
    process.exit(1);
  }

  const lista = JSON.parse(
    await readFile(path.join(__dirname, "lista-fotos.json"), "utf8")
  );

  console.log(`\n${lista.length} produtos na lista.\n`);

  const email = await perguntar("E-mail do painel: ");
  const senha = await perguntar("Senha: ", { esconder: true });

  const supabase = createClient(url, anonKey);
  const { error: erroLogin } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (erroLogin) {
    console.error("Falha no login:", erroLogin.message);
    process.exit(1);
  }
  console.log("Login OK.");

  // pula produto que já tem foto (permite rodar o script várias vezes com segurança)
  const { data: jaTemFoto, error: erroConsulta } = await supabase
    .from("produtos")
    .select("id")
    .not("imagem_url", "is", null);
  if (erroConsulta) {
    console.error("Falha ao consultar produtos existentes:", erroConsulta.message);
    process.exit(1);
  }
  const idsComFoto = new Set((jaTemFoto || []).map((p) => p.id));
  const pendentes = lista.filter((item) => !idsComFoto.has(item.id));
  const jaFeitos = lista.length - pendentes.length;
  if (jaFeitos > 0) console.log(`${jaFeitos} produtos já tinham foto, pulando.`);
  console.log(`Começando upload de ${pendentes.length} produtos...\n`);

  let sucesso = 0;
  const falhas = [];

  for (const item of pendentes) {
    try {
      const bytes = await readFile(item.arquivo);
      const ext = path.extname(item.arquivo).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
      const nomeArquivo = `${crypto.randomUUID()}${ext}`;

      const { error: erroUpload } = await supabase.storage
        .from("produtos")
        .upload(nomeArquivo, bytes, { contentType, upsert: false });
      if (erroUpload) throw erroUpload;

      const { error: erroUpdate } = await supabase
        .from("produtos")
        .update({ imagem_url: nomeArquivo })
        .eq("id", item.id);
      if (erroUpdate) throw erroUpdate;

      sucesso++;
      console.log(`OK  - ${item.nome}`);
    } catch (err) {
      falhas.push({ nome: item.nome, erro: err.message || String(err) });
      console.log(`FALHOU - ${item.nome}: ${err.message || err}`);
    }
  }

  console.log(`\n${sucesso}/${pendentes.length} produtos atualizados com sucesso.`);
  if (falhas.length) {
    console.log(`\n${falhas.length} falharam:`);
    falhas.forEach((f) => console.log(`  - ${f.nome}: ${f.erro}`));
  }

  process.exit(0);
}

main();
