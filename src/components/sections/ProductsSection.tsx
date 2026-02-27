import { motion } from "framer-motion";
import productChitosan from "@/assets/product-chitosan.jpg";
import productSmartTraps from "@/assets/product-smart-traps.jpg";
import productFurniture from "@/assets/product-furniture.jpg";
import productAcoustic from "@/assets/product-acoustic.jpg";
import productWoodVinegar from "@/assets/product-wood-vinegar.jpg";

const PRODUCTS = [
  { name: "Chitosan", image: productChitosan, description: "A natural biopolymer extracted from waste, used for plant protection and crop coating.", benefit: "100% Biodegradable" },
  { name: "Smart Traps", image: productSmartTraps, description: "Eco-friendly traps designed to control fall armyworm without harmful chemicals.", benefit: "Chemical-Free Pest Control" },
  { name: "Recycled Furniture", image: productFurniture, description: "Sustainable furniture crafted from compressed agricultural residues and corn stalks.", benefit: "Zero Deforestation" },
  { name: "Acoustic Panels", image: productAcoustic, description: "Sound-absorbing wall panels made from corn waste fibers for offices and studios.", benefit: "Waste-to-Product" },
  { name: "Wood Vinegar", image: productWoodVinegar, description: "Organic liquid produced through pyrolysis, used as a natural pesticide and soil enhancer.", benefit: "Organic & Non-Toxic" },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const ProductsSection = () => {
  return (
    <section id="products" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} variants={fadeUp}>
          <h2 className="font-display text-4xl font-bold text-primary mb-3">Our Products</h2>
          <p className="font-body text-foreground/70 max-w-xl mx-auto">Innovative, eco-friendly solutions made from corn waste and agricultural residues.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.name}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              variants={fadeUp}
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" loading="lazy" />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{product.name}</h3>
                <p className="font-body text-sm text-foreground/60 leading-relaxed mb-4 flex-1">{product.description}</p>
                <span className="inline-block self-start px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-bold">🌿 {product.benefit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
