"use client";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MoleculeStructure from "../../components/MoleculeStructure/index";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  createMoleculeGenerationHistory,
  getMoleculeGenerationHistoryByUser,
} from "@/lib/actions/molecule-generation.action";
import { getUserByEmail } from "@/lib/actions/user.actions";
import axios from "axios";
import {
  FlaskConicalIcon,
  ChevronDownIcon,
  PlayIcon,
  BarChart3Icon,
  AtomIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
  ActivityIcon,
  ClockIcon,
  FileTextIcon,
  SaveIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const ModalLayout = () => {
  const { data: session } = useSession();
  const [smiles, setSmiles] = useState(
    "CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C",
  );
  const [proteinSequence, setProteinSequence] = useState("");
  const [numMolecules, setNumMolecules] = useState("10");
  const [minSimilarity, setMinSimilarity] = useState("0.3");
  const [particles, setParticles] = useState("30");
  const [iterations, setIterations] = useState("10");
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [bindingAffinity, setBindingAffinity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const user = await getUserByEmail(session.user.email);
          setUserId(user._id);
          const historyFromServer = await getMoleculeGenerationHistoryByUser(
            user._id,
          );
          setHistory(historyFromServer);
        } catch (error) {
          console.error("Error fetching user or history:", error);
        }
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handleDTIPrediction = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setBindingAffinity(null);

    try {
      interface PredictionResponse {
        binding_affinity: string;
      }

      const response = await axios.post<PredictionResponse>(
        "http://localhost:5000/predict_api",
        {
          smiles: smiles,
          protein_sequence: proteinSequence,
        },
      );
      setBindingAffinity(response.data.binding_affinity);
    } catch (error: any) {
      console.error("Error predicting binding affinity:", error);
      setBindingAffinity(`Error: ${error.message || "Prediction failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const API_KEY =
      "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";

    const invokeUrl =
      "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";

    const payload = {
      algorithm: "CMA-ES",
      num_molecules: parseInt(numMolecules),
      property_name: "QED",
      minimize: false,
      min_similarity: parseFloat(minSimilarity),
      particles: parseInt(particles),
      iterations: parseInt(iterations),
      smi: smiles,
    };

    try {
      const response = await fetch(invokeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const generatedMolecules = JSON.parse(data.molecules).map((mol: any) => ({
        structure: mol.sample,
        score: mol.score,
      }));

      setMolecules(generatedMolecules);

      if (userId) {
        await createMoleculeGenerationHistory(
          {
            smiles,
            numMolecules: parseInt(numMolecules),
            minSimilarity: parseFloat(minSimilarity),
            particles: parseInt(particles),
            iterations: parseInt(iterations),
            generatedMolecules,
          },
          userId,
        );

        const updatedHistory = await getMoleculeGenerationHistoryByUser(userId);
        setHistory(updatedHistory);
      } else {
        console.error("User ID is not available.");
      }

      console.log(generatedMolecules);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb pageName="AI Drug Discovery" />
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 dark:text-green-400">
                AI Models Active
              </span>
            </div>
          </div>
        </div>

        {/* Header Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="gradient" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <AtomIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generated
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {molecules.length}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUpIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  94%
                </p>
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <BarChart3Icon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Score
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  0.82
                </p>
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ClockIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Time
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  2.3s
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stroke dark:border-strokedark">
          <nav className="flex space-x-8">
            {[
              { id: "generate", label: "Generate", icon: SparklesIcon },
              { id: "predict", label: "Predict", icon: SearchIcon },
              { id: "history", label: "History", icon: FileTextIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "generate" && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <FlaskConicalIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        Molecule Generation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Generate novel molecules using AI
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="SMILES String"
                        value={smiles}
                        onChange={(e) => setSmiles(e.target.value)}
                        placeholder="Enter SMILES string"
                        helperText="Chemical structure representation"
                        required
                      />
                      <Input
                        label="Number of Molecules"
                        type="number"
                        value={numMolecules}
                        onChange={(e) => setNumMolecules(e.target.value)}
                        placeholder="10"
                        helperText="How many molecules to generate"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Min Similarity"
                        type="number"
                        step="0.1"
                        value={minSimilarity}
                        onChange={(e) => setMinSimilarity(e.target.value)}
                        placeholder="0.3"
                        helperText="Minimum similarity threshold"
                        required
                      />
                      <Input
                        label="Particles"
                        type="number"
                        value={particles}
                        onChange={(e) => setParticles(e.target.value)}
                        placeholder="30"
                        helperText="Number of particles"
                        required
                      />
                      <Input
                        label="Iterations"
                        type="number"
                        value={iterations}
                        onChange={(e) => setIterations(e.target.value)}
                        placeholder="10"
                        helperText="Number of iterations"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin mr-2">⚛️</div>
                          Generating Molecules...
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-5 h-5 mr-2" />
                          Generate Molecules
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            )}

            {activeTab === "predict" && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <ActivityIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        Binding Affinity Prediction
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Predict drug-target interactions
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleDTIPrediction} className="space-y-6">
                    <Input
                      label="SMILES String"
                      value={smiles}
                      onChange={(e) => setSmiles(e.target.value)}
                      placeholder="Enter SMILES string"
                      helperText="Chemical structure representation"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-black dark:text-white mb-2">
                        Protein Sequence
                      </label>
                      <textarea
                        value={proteinSequence}
                        onChange={(e) => setProteinSequence(e.target.value)}
                        placeholder="Enter protein sequence..."
                        className="w-full p-3 border border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-form-input text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                        rows={4}
                        required
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Target protein sequence for binding analysis
                      </p>
                    </div>

                    {bindingAffinity && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <BarChart3Icon className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              Binding Affinity Result
                            </p>
                            <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                              {bindingAffinity}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      fullWidth
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin mr-2">🔬</div>
                          Predicting Binding Affinity...
                        </>
                      ) : (
                        <>
                          <SearchIcon className="w-5 h-5 mr-2" />
                          Predict Binding Affinity
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            )}

            {activeTab === "history" && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileTextIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                          Generation History
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Your previous generations
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <SaveIcon className="w-4 h-4 mr-2" />
                      Export All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {history.length > 0 ? (
                      history.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-black dark:text-white">
                              Generation #{index + 1}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            SMILES: {item.smiles}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Generated {item.generatedMolecules.length} molecules
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          No generation history found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Molecule Visualization */}
            <Card>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Molecule Visualization
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <MoleculeStructure smiles={smiles} />
                </div>
              </div>
            </Card>

            {/* Generated Molecules */}
            {molecules.length > 0 && (
              <Card>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                    Generated Molecules ({molecules.length})
                  </h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {molecules.map((molecule: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-black dark:text-white">
                            Molecule {index + 1}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Score: {molecule.score.toFixed(3)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
                          {molecule.structure}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" fullWidth>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Current Session
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <AtomIcon className="w-4 h-4 mr-2" />
                    Load Example
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ModalLayout;
