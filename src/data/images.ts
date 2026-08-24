import hero from "@/assets/hero.jpg";
import rio from "@/assets/dest-rio.jpg";
import sp from "@/assets/dest-sp.jpg";
import salvador from "@/assets/dest-salvador.jpg";
import portoSeguro from "@/assets/dest-porto-seguro.jpg";
import maceio from "@/assets/dest-maceio.jpg";
import recife from "@/assets/dest-recife.jpg";
import fortaleza from "@/assets/dest-fortaleza.jpg";
import gramado from "@/assets/dest-gramado.jpg";
import florianopolis from "@/assets/dest-florianopolis.jpg";
import natal from "@/assets/dest-natal.jpg";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";

/** Registro central de imagens. Trocar por URLs de CDN quando houver dados reais. */
export const IMAGES: Record<string, string> = {
  hero,
  rio,
  sp,
  salvador,
  "porto-seguro": portoSeguro,
  maceio,
  recife,
  fortaleza,
  gramado,
  florianopolis,
  natal,
  "hotel-1": hotel1,
  "hotel-2": hotel2,
  "hotel-3": hotel3,
};

export const img = (key: string) => IMAGES[key] ?? IMAGES['hero']!;
