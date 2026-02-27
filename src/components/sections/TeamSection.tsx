import { motion } from "framer-motion";
import teamAhmed from "@/assets/team-ahmed.jpg";
import teamSara from "@/assets/team-sara.jpg";
import teamYoussef from "@/assets/team-youssef.jpg";
import teamNadia from "@/assets/team-nadia.jpg";

const TEAM_MEMBERS = [
  { name: "Ahmed Benali", role: "Founder & CEO", bio: "Passionate about sustainable agriculture and circular economy. Leading Cornflex's vision to transform waste into value.", image: teamAhmed },
  { name: "Sara Mansour", role: "Head of R&D", bio: "Biochemist specializing in biopolymers and natural pest control solutions derived from agricultural residues.", image: teamSara },
  { name: "Youssef Karim", role: "Product Designer", bio: "Industrial designer focused on creating sustainable furniture and acoustic panels from corn waste fibers.", image: teamYoussef },
  { name: "Nadia Chaker", role: "Operations Manager", bio: "Expert in supply chain management, ensuring eco-friendly production and distribution of all Cornflex products.", image: teamNadia },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const TeamSection = () => {
  return (
    <section id="team" className="py-16 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} variants={fadeUp}>
          <h2 className="font-display text-4xl font-bold text-primary mb-3">Our Team</h2>
          <p className="font-body text-foreground/70 max-w-xl mx-auto">Meet the people behind Cornflex — driven by passion for sustainability and innovation.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center hover:shadow-md transition-shadow"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              variants={fadeUp}
            >
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20" />
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{member.name}</h3>
              <p className="font-body text-sm text-secondary font-semibold mb-3">{member.role}</p>
              <p className="font-body text-sm text-foreground/60 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
