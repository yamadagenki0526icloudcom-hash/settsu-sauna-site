# 摂津サウナ Webサイト — AI共同作業ガイド（Claude Code / Codex 共通）

このリポジトリは、げんきさん（摂津サウナ学生連盟 Web班リーダー）のプロジェクトサイト。
**Claude CodeとCodexが同じルールで共同編集する。** このファイルが唯一の作業指示書（CLAUDE.mdはこのファイルへのシンボリックリンク）。

## プロジェクト背景（要点）

- 「避ス地 未知の駅 摂津サウナ」= 花岡工務店（大阪府摂津市新在家2-1-19）の地方創生プロジェクト。2027年5月竣工予定
- **8/1にCAMPFIREクラウドファンディング開始** — 当面のサイトの最優先目的はクラファン送客
- 詳細な背景・決定事項はObsidian Vault: `~/Documents/Obsidian Vault/Vault/Context/Project-摂津サウナ.md`（正本）

## 構成

| パス | 内容 |
| --- | --- |
| `index.html` + `style.css` + `script.js` | クラファン公式サイトLP（developios.com風、GSAP+Lenis） |
| `shop/` (`index.html` `product.html` `shop.css` `shop.js`) | ECたたき台「避ス地商店」（Brunello Cucinelli /ai 参考、静的デモ） |
| `assets/` | クラファンPDF由来の画像（hero.jpg=パース、plan-*.jpg=図面、students.jpg=学生連盟） |

- 公開URL: https://yamadagenki0526icloudcom-hash.github.io/settsu-sauna-site/ （GitHub Pages、`main`にpushで1〜2分後に自動反映）
- ローカルプレビュー: `python3 -m http.server 8130 --directory ~/settsu-sauna-site`（Claude Codeはlaunch.json `settsu-sauna` 使用）

## デザイントークン（変えない）

- **LP**: paper `#FBFAF7` / ink `#14213D` / sun `#F2B705` / ember `#D93A2B`（emberは「御支縁」等の縁関連のみ）。見出し=Zen Kaku Gothic New 900、クラファン部のみShippori Mincho B1
- **商店**: ivory `#F7F4EE` / char `#2B2A26` / 控えめなsun `#D9A404`。明朝+Cormorant Garamond、ヘアライン罫線。LPより静かなトーンを保つ

## 作業ルール

1. **作業前に必ず `git pull`**。作業単位を小さくコミットし、すぐpush（もう一方のAIとのコンフリクト防止）
2. コミットメッセージは日本語1行＋自分の署名行（Codexは`Co-Authored-By: Codex`、Claudeは`Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`）
3. **CSSを編集したらHTML側の`?v=N`を+1する**（GitHub Pages/ブラウザのキャッシュ対策）
4. **スマホ確認必須**: 375px幅で崩れないこと（過去にナビ折返し・縦書き溢れ・見出し折返しの事故あり。`@media(max-width:600px)`と`900px`に集約）
5. `<meta name="robots" content="noindex">` は**公開OKが出るまで全ページ維持**
6. 事実に関わるコピー（金額・日付・「99.9%」等の実話、価格）は勝手に変えない・増やさない。商品ラインナップは全部仮 → 確定情報はVaultのProject-摂津サウナ.mdを参照
7. 意味のある作業をしたらVaultの `Activity-Log/YYYY-MM.md` に追記し、`STATE.md` の摂津サウナ行を上書き更新（AI間の引き継ぎはVault経由が正本）
8. 大きいバイナリ（元PDF等）はコミットしない。画像は既存の`assets/`加工方針（JPG・幅1600〜2200px・数百KB）に合わせる

## 未確定・保留事項（2026-07-13時点）

- ドメイン名・成功報酬条件・クラファン原稿の担当 → 次回打ち合わせで確定予定
- CAMPFIREページURL未定 → 決まったらLP `#support` のボタンと`shop/`のトップバーに差し込む
- EC実売基盤（BASE/Shopify/自作）未定 → 現状の`shop/`はデザイン検証用の静的デモ
- 実写素材（花岡氏・現場・イベント写真）待ち → 届いたらSVGプレースホルダから差し替え
