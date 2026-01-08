import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Eye, Heart, Sparkles, Target } from "lucide-react";
import React from "react";

const About = () => {
  const whatDrivesUs = [
    {
      id: 1,
      title: "Our Mission",
      desc: "To create a trusted marketplace that connects verified tile dealers with customers, making tile shopping transparent, convenient, and enjoyable.",
      icon: Target,
    },
    {
      id: 2,
      title: "Our Vision",
      desc: "To become India's go-to platform for tiles, where everyone from homeowners to architects can find exactly what they need with confidence.",
      icon: Eye,
    },
    {
      id: 3,
      title: "Our Values",
      desc: "Trust, transparency, and putting customers first. We believe in building genuine relationships between dealers and customers based on quality.",
      icon: Heart,
    },
  ];

  return (
    <>
      <section className="flex items-center justify-center py-20 px-5 bg-linear-to-b from-primary/5 to-transparent -z-5">
        <div className="flex flex-col items-center justify-center md:space-y-10 space-y-5">
          <Badge
            variant={"outline"}
            className="bg-accent text-accent-foreground border-accent-foreground/20 px-5 py-2"
          >
            <Sparkles /> A Fresh Approach to Tile Shopping
          </Badge>
          <div className="text-center w-full max-w-3xl space-y-2">
            <h1 className="text-4xl md:text-7xl font-bold font-serif">
              About TileHub
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              We're building India's most trusted tile marketplace — connecting
              quality dealers with customers who deserve a better way to
              discover and buy tiles.
            </p>
          </div>
          <div>
            <Button size={"lg"} className="md:text-xl md:p-6 font-light">
              Explore Tiles <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full max-w-7xl flex flex-col items-center mx-auto my-20">
        <div className="text-center w-full">
          <h1 className="text-3xl font-serif">What Drives Us</h1>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-10 w-full max-w-5xl">
          {whatDrivesUs.map((item) => (
            <Card key={item.id} className="items-center border-primary/50">
                <div className="p-3 rounded-lg bg-accent text-accent-foreground"><item.icon /></div>
                <CardContent className="text-center space-y-2">
                    <h1 className="text-xl font-bold font-sans">{item.title}</h1>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
