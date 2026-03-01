import { motion } from "framer-motion";
import teamEman from "@/assets/1.jpeg";
import teamAhmed from "@/assets/2.jpeg";
import teamShahd from "@/assets/3.jpeg";
import teamHager from "@/assets/4.jpeg";
import teamNer from "@/assets/5.jpeg";
import teamRO from "@/assets/6.jpeg";
import teamSA from "@/assets/7.jpeg";
import teamSH from "@/assets/8.jpeg";



const TEAM_MEMBERS = [
  { name: "Eman Gad", role: "Project team",  image: teamEman },
  { name: "Ahmed Galal", role: "Project team",  image: teamAhmed },
  { name: "Shahd ibrahim", role: "Logistics team",  image: teamShahd },
  { name: "Hager Hosni", role: "Presentation team",  image: teamHager },
  { name: "Nermin Hussein", role: "Presentation team",  image: teamNer },
  { name: "Roqia belal", role: "Logistics team",  image: teamRO },
  { name: "Yara Waled", role: "PR & FR team",  image: teamSA },
  { name: "Shahd Shatla", role: "HR team",  image: teamSH },
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
