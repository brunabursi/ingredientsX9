import { OCRObservation } from '../../../jsUtils/OCRmodule';
import { type IngredientLookup } from '../models/ingredientsLookup';

export const mockedObservations: OCRObservation[] = [ { bounds: 
  [ 0.05289102869258617,
    0.7441796053310817,
    0.057534213860829665,
    0.20733050593623414 ],
 text: 'Pele' },
{ text: 'Avène',
 bounds: 
  [ 0.17151162352735536,
    0.7312661475819564,
    0.034883729616800946,
    0.15503876297562214 ] },
{ bounds: 
  [ 0.1729651126552055,
    0.2428940581494794,
    0.02325582106908161,
    0.14728681776258679 ],
 text: 'VICHY' },
{ text: 'VITASAY',
 bounds: 
  [ 0.26889533619673384,
    0.22739018767778618,
    0.061046536763509074,
    0.4780361599392361 ] },
{ bounds: 
  [ 0.42984072698732056,
    0.26060338209929446,
    0.026801409324010206,
    0.4193074826841001 ],
 text: 'EMBALAGEM ECONÔMICA' },
{ text: 'NOITE',
 bounds: 
  [ 0.4709302289276685,
    0.2067183424834127,
    0.023255821069081584,
    0.13695090964988432 ] },
{ text: 'SUPLEMENTO ALIMENTAR EM COMPRIMIDO',
 bounds: 
  [ 0.5100004744814454,
    0.20106400709514294,
    0.023744426170984823,
    0.473889555754485 ] },
{ bounds: 
  [ 0.5300578069665516,
    0.2005923261195499,
    0.04643234809239705,
    0.5264772768373842 ],
 text: 'MELATONINA' },
{ bounds: 
  [ 0.7340116259375528,
    0.661498707766739,
    0.024709306160608957,
    0.08010335851598671 ],
 text: '150' },
{ text: 'COMPRIMIDOS',
 bounds: 
  [ 0.7576291665956215,
    0.6195314883535391,
    0.027050262689590432,
    0.13348565278229885 ] },
{ text: 'ORODISPERSÍVEIS',
 bounds: 
  [ 0.7676531316337466,
    0.5811954256690451,
    0.03032092452049251,
    0.17212698194715714 ] },
{ text: 'DISSOLVE RÁPIDO',
 bounds: 
  [ 0.6264534737897008,
    0.20930232749581112,
    0.027616303165753697,
    0.40568474663628473 ] },
{ bounds: 
  [ 0.6537565791428738,
    0.20902440060527994,
    0.02644664645195005,
    0.32881656222873257 ],
 text: 'USO NOTURNO' },
{ bounds: 
  [ 0.7238372017802398,
    0.21705426650474147,
    0.01453489710887268,
    0.23255813033492467 ],
 text: 'SABOR LARANJA' },
{ text: 'CONTÉM AROMATIZANTE SINTÉTICO',
 bounds: 
  [ 0.7743925682814866,
    0.2193494758468869,
    0.014757983883221915,
    0.2459986651385272 ] },
{ bounds: 
  [ 0.7845571601457002,
    0.22150940550720655,
    0.01570832530657451,
    0.1564294885706018 ],
 text: 'IDÊNTICO AO NATURAL' },
{ text: 'LONAL MIELAIVITINA TSO',
 bounds: 
  [ 0.9504352114575243,
    0.3227868958792952,
    0.020480952660242746,
    0.31303773102936916 ] },
{ text: 'OMPRIMIDOS',
 bounds: 
  [ 0.9617018470889447,
    0.4634537680149866,
    0.025358122587204046,
    0.1817162549054181 ] },
{ bounds: 
  [ 0.4215116247340151,
    0.038759689894360294,
    0.0421511689821879,
    0.08785529666476777 ],
 text: 'ISAY' },
{ text: '90',
 bounds: 
  [ 0.7398255800727969,
    -1.9095622860731964e-9,
    0.02616279323895776,
    0.05167959001329214 ] },
{ text: 'COMPRI',
 bounds: 
  [ 0.7623973996785848,
    -0.004209194486861412,
    0.024715880552927616,
    0.07824429406060107 ] },
{ text: 'ORODIST',
 bounds: 
  [ 0.7693361607121969,
    -0.005261156253044685,
    0.029803661505381274,
    0.08500869185836235 ] } ]



export const mockedMatchedObervations: IngredientLookup[] = [
  {
    id: 1001,
    ingredientName: "melatonina",
    riskLevel: "low",
    description: "Hormone that regulates sleep-wake cycle"
  },
  {
    id: 1002,
    ingredientName: "avène",
    riskLevel: "low",
    description: "Thermal spring water based skincare brand"
  },
  {
    id: 1003,
    ingredientName: "vichy",
    riskLevel: "low",
    description: "Mineral-rich thermal water skincare brand"
  },
  {
    id: 1004,
    ingredientName: "laranja",
    riskLevel: "low",
    description: "Orange flavor/extract"
  },
  {
    id: 1005,
    ingredientName: "aromatizante sintético",
    riskLevel: "medium",
    description: "Synthetic flavoring agent"
  },
  {
    id: 1006,
    ingredientName: "orodispersíveis",
    riskLevel: "low",
    description: "Orally disintegrating tablet form"
  },
  {
    id: 1007,
    ingredientName: "econômica",
    riskLevel: "low",
    description: "Economic/value packaging claim"
  },
  {
    id: 1008,
    ingredientName: "comprimidos",
    riskLevel: "low",
    description: "Tablet form of medication or supplement"
  },
  {
    id: 1009,
    ingredientName: "suplemento alimentar",
    riskLevel: "low",
    description: "Dietary supplement classification"
  },
  {
    id: 1010,
    ingredientName: "noturno",
    riskLevel: "low",
    description: "Intended for nighttime use"
  }
];

