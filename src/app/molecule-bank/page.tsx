"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, FlaskConical, Atom } from "lucide-react";
import ComponetHeader from "@/components/ComponentHeader/ComponentHeader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import MoleculeStructure from "@/components/MoleculeStructure/index";

const moleculeBank = [
  {
    moleculeName: "Aspirin",
    smilesStructure: "CC(=O)OC1=CC=CC=C1C(O)=O",
    molecularWeight: 180.16,
    categoryUsage: "Pain reliever/NSAID",
    description: "Widely used analgesic and anti-inflammatory drug",
    applications: ["Pain relief", "Anti-inflammatory", "Cardioprotective"],
  },
  {
    moleculeName: "Caffeine",
    smilesStructure: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    molecularWeight: 194.19,
    categoryUsage: "Stimulant",
    description: "Central nervous system stimulant",
    applications: ["Cognitive enhancement", "Energy boost", "Performance"],
  },
  {
    moleculeName: "Benzene",
    smilesStructure: "C1=CC=CC=C1",
    molecularWeight: 78.11,
    categoryUsage: "Industrial solvent",
    description: "Aromatic hydrocarbon used in chemical synthesis",
    applications: ["Solvent", "Chemical synthesis", "Polymer production"],
  },
  {
    moleculeName: "Glucose",
    smilesStructure: "C(C1C(C(C(C(O1)O)O)O)O)O",
    molecularWeight: 180.16,
    categoryUsage: "Energy source/sugar",
    description: "Primary source of energy for living organisms",
    applications: ["Energy metabolism", "Cellular respiration", "Nutrition"],
  },
  {
    moleculeName: "Penicillin",
    smilesStructure: "CC1(C2C(C(C(O2)N1C(=O)COC(=O)C)C)S)C=O",
    molecularWeight: 334.39,
    categoryUsage: "Antibiotic",
    description: "Beta-lactam antibiotic against bacterial infections",
    applications: ["Bacterial infections", "Surgical prophylaxis", "Respiratory infections"],
  },
  {
    moleculeName: "Ibuprofen",
    smilesStructure: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    molecularWeight: 206.28,
    categoryUsage: "Pain reliever/NSAID",
    description: "Non-steroidal anti-inflammatory drug",
    applications: ["Pain relief", "Anti-inflammatory", "Fever reduction"],
  },
  {
    moleculeName: "Acetaminophen",
    smilesStructure: "CC(=O)NC1=CC=C(O)C=C1",
    molecularWeight: 151.16,
    categoryUsage: "Pain reliever/Antipyretic",
    description: "Analgesic and antipyretic medication",
    applications: ["Pain relief", "Fever reduction", "Headache treatment"],
  },
  {
    moleculeName: "Morphine",
    smilesStructure: "CN1CCC23C4C1CC(C2C3O)OC5=CC=CC=C45",
    molecularWeight: 285.34,
    categoryUsage: "Pain reliever/Opiate",
    description: "Powerful opioid analgesic for severe pain",
    applications: ["Severe pain", "Post-operative care", "Palliative care"],
  },
  {
    moleculeName: "Nicotine",
    smilesStructure: "CN1CCCC1C2=CN=CC=C2",
    molecularWeight: 162.23,
    categoryUsage: "Stimulant",
    description: "Alkaloid found in tobacco plants",
    applications: ["Neurotransmitter research", "Smoking cessation", "Cognitive studies"],
  },
  {
    moleculeName: "Ethanol",
    smilesStructure: "CCO",
    molecularWeight: 46.07,
    categoryUsage: "Alcohol/Disinfectant",
    description: "Simple alcohol with antiseptic properties",
    applications: ["Disinfection", "Solvent", "Fuel additive"],
  },
];

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMolecules, setFilteredMolecules] = useState(moleculeBank);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", ...Array.from(new Set(moleculeBank.map(m => m.categoryUsage)))];

  useEffect(() => {
    let filtered = moleculeBank;
    
    if (searchQuery) {
      filtered = filtered.filter((molecule) =>
        molecule.moleculeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.categoryUsage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(m => m.categoryUsage === selectedCategory);
    }
    
    setFilteredMolecules(filtered);
  }, [searchQuery, selectedCategory]);

  const stats = [
    {
      title: "Total Molecules",
      value: moleculeBank.length,
      icon: <Atom className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Drug Categories",
      value: categories.length - 1,
      icon: <FlaskConical className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Search Results",
      value: filteredMolecules.length,
      icon: <Search className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <DefaultLayout>
      <ComponetHeader pageName="Molecule Bank" containActionButton={true} />
      
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <AnimatedContainer key={index} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </h3>
                    <p className="text-muted-foreground">{stat.title}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </AnimatedContainer>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Input
                placeholder="Search molecules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                className="min-w-[300px]"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-stroke dark:border-form-strokedark rounded-lg bg-white dark:bg-form-input text-black dark:text-white focus:border-primary focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Molecule
              </Button>
            </div>
          </div>
        </Card>

        {/* Molecules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMolecules.map((molecule, index) => (
            <AnimatedContainer key={index} delay={index * 0.05}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {molecule.moleculeName}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {molecule.categoryUsage}
                    </span>
                  </div>
                  
                  <div className="flex justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <MoleculeStructure
                      id={`molecule-${index}`}
                      structure={molecule.smilesStructure}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Molecular Weight:</span>
                      <span className="font-medium">{molecule.molecularWeight} g/mol</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {molecule.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {molecule.applications.map((app, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </AnimatedContainer>
          ))}
        </div>

        {filteredMolecules.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No molecules found matching your search criteria.</p>
            </div>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Page;
