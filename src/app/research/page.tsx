"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState } from "react";
import { Search, FlaskConical, Atom, BookOpen, Download, Eye, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

interface CompoundData {
  MolecularFormula: string;
  MolecularWeight: number;
  InChIKey: string;
  CanonicalSMILES: string;
  IsomericSMILES: string;
  IUPACName: string;
  XLogP: number;
  ExactMass: number;
  MonoisotopicMass: number;
  TPSA: number;
  Complexity: number;
  Charge: number;
  HBondDonorCount: number;
  HBondAcceptorCount: number;
  RotatableBondCount: number;
  HeavyAtomCount: number;
}

export default function PubChem() {
  const [compoundName, setCompoundName] = useState("");
  const [compoundData, setCompoundData] = useState<CompoundData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompoundData = async () => {
    setLoading(true);
    setError("");
    setCompoundData(null);

    try {
      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
          compoundName
        )}/property/MolecularFormula,MolecularWeight,InChIKey,IUPACName,XLogP,ExactMass,MonoisotopicMass,TPSA,Complexity,Charge,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount/JSON`
      );

      if (!response.ok) {
        throw new Error("Compound not found");
      }

      const data = await response.json();

      if (
        data?.PropertyTable?.Properties &&
        data.PropertyTable.Properties.length > 0
      ) {
        const compoundInfo = data.PropertyTable.Properties[0];
        setCompoundData({
          MolecularFormula: compoundInfo.MolecularFormula,
          MolecularWeight: compoundInfo.MolecularWeight,
          InChIKey: compoundInfo.InChIKey,
          CanonicalSMILES: compoundInfo.CanonicalSMILES,
          IsomericSMILES: compoundInfo.IsomericSMILES,
          IUPACName: compoundInfo.IUPACName,
          XLogP: compoundInfo.XLogP,
          ExactMass: compoundInfo.ExactMass,
          MonoisotopicMass: compoundInfo.MonoisotopicMass,
          TPSA: compoundInfo.TPSA,
          Complexity: compoundInfo.Complexity,
          Charge: compoundInfo.Charge,
          HBondDonorCount: compoundInfo.HBondDonorCount,
          HBondAcceptorCount: compoundInfo.HBondAcceptorCount,
          RotatableBondCount: compoundInfo.RotatableBondCount,
          HeavyAtomCount: compoundInfo.HeavyAtomCount,
        });
      } else {
        throw new Error("Compound data is not available");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchCompoundData();
    }
  };

  const generateIframeUrl = (section: "2D-Structure" | "3D-Conformer") => {
    return `https://pubchem.ncbi.nlm.nih.gov/compound/${encodeURIComponent(
      compoundName
    )}#section=${section}&embed=true`;
  };

  const drugProperties = [
    { 
      label: "Molecular Weight", 
      value: compoundData?.MolecularWeight ? `${compoundData.MolecularWeight} g/mol` : "N/A",
      icon: <Atom className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "LogP", 
      value: compoundData?.XLogP?.toString() || "N/A",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "TPSA", 
      value: compoundData?.TPSA ? `${compoundData.TPSA} Ų` : "N/A",
      icon: <BookOpen className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500"
    },
    { 
      label: "H-Donors", 
      value: compoundData?.HBondDonorCount?.toString() || "N/A",
      icon: <Atom className="w-4 h-4" />,
      color: "from-orange-500 to-red-500"
    },
  ];

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compound Research</h1>
            <p className="text-muted-foreground">Search and analyze chemical compounds from PubChem</p>
          </div>
          <div className="w-full lg:w-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                value={compoundName}
                onChange={(e) => setCompoundName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a compound name (e.g., aspirin)"
                className="min-w-[300px]"
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Button onClick={fetchCompoundData} disabled={loading || !compoundName.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <AnimatedContainer>
            <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-red-500" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </Card>
          </AnimatedContainer>
        )}

        {/* Loading State */}
        {loading && (
          <AnimatedContainer>
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-muted-foreground">Searching compound database...</p>
              </div>
            </Card>
          </AnimatedContainer>
        )}

        {/* Results */}
        {compoundData && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {drugProperties.map((prop, index) => (
                <AnimatedContainer key={index} delay={index * 0.1}>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{prop.label}</p>
                        <p className="text-lg font-semibold text-foreground">{prop.value}</p>
                      </div>
                      <div className={`p-2 rounded-full bg-gradient-to-r ${prop.color} text-white`}>
                        {prop.icon}
                      </div>
                    </div>
                  </Card>
                </AnimatedContainer>
              ))}
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedContainer delay={0.2}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Atom className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Molecular Formula:</span>
                      <span className="font-mono text-foreground">{compoundData.MolecularFormula}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Molecular Weight:</span>
                      <span className="font-mono text-foreground">{compoundData.MolecularWeight} g/mol</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">InChIKey:</span>
                      <span className="font-mono text-xs text-foreground break-all">{compoundData.InChIKey}</span>
                    </div>
                    <div className="border-t pt-3">
                      <span className="text-muted-foreground">IUPAC Name:</span>
                      <p className="font-mono text-sm text-foreground mt-1 break-words">{compoundData.IUPACName}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={0.3}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Drug-like Properties
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">XLogP:</span>
                      <span className="font-mono text-foreground">{compoundData.XLogP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TPSA:</span>
                      <span className="font-mono text-foreground">{compoundData.TPSA} Ų</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">H-Bond Donors:</span>
                      <span className="font-mono text-foreground">{compoundData.HBondDonorCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">H-Bond Acceptors:</span>
                      <span className="font-mono text-foreground">{compoundData.HBondAcceptorCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rotatable Bonds:</span>
                      <span className="font-mono text-foreground">{compoundData.RotatableBondCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Heavy Atoms:</span>
                      <span className="font-mono text-foreground">{compoundData.HeavyAtomCount}</span>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>
            </div>

            {/* SMILES Information */}
            <AnimatedContainer delay={0.4}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Chemical Identifiers
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Canonical SMILES:</label>
                    <div className="mt-1 p-3 bg-accent rounded-lg">
                      <code className="text-sm break-all">{compoundData.CanonicalSMILES || "Not available"}</code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Isomeric SMILES:</label>
                    <div className="mt-1 p-3 bg-accent rounded-lg">
                      <code className="text-sm break-all">{compoundData.IsomericSMILES || "Not available"}</code>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedContainer>

            {/* Structure Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedContainer delay={0.5}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      2D Structure
                    </h3>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="relative">
                    <iframe
                      className="w-full rounded-lg border"
                      style={{ height: "400px" }}
                      src={generateIframeUrl("2D-Structure")}
                      title="2D Structure"
                    />
                  </div>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={0.6}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Atom className="w-5 h-5" />
                      3D Conformer
                    </h3>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="relative">
                    <iframe
                      className="w-full rounded-lg border"
                      style={{ height: "400px" }}
                      src={generateIframeUrl("3D-Conformer")}
                      title="3D Conformer"
                    />
                  </div>
                </Card>
              </AnimatedContainer>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!compoundData && !loading && !error && (
          <AnimatedContainer>
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Search Chemical Compounds</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a compound name to retrieve detailed information from the PubChem database, 
                  including molecular properties, structure, and drug-like characteristics.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Aspirin", "Caffeine", "Ibuprofen", "Morphine"].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setCompoundName(example);
                        fetchCompoundData();
                      }}
                      className="px-3 py-1 text-sm bg-accent hover:bg-accent/80 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </AnimatedContainer>
        )}
      </div>
    </DefaultLayout>
  );
}
