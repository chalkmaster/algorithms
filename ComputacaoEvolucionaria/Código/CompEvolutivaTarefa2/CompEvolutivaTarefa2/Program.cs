using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CompEvolutivaTarefa2
{
    public class Parameters
    {
        public static int NumberOfExperiments = 1;
        public static int NumberOfIndividuals = 100;
        public static double CrossOverFactor = 0.8;
        public static double MutationFactior = 0.01;
        public static double[] OptimalValue = {0.0, 0.0};
        public static int MaxGenerations = 100;
        public static int MaxReal = 10;
        public static int MinReal = -10;
        public static int NumberOfDimensions = 2;
    }

    public class Converters
    {
        public static double ConvertGenToReal(BitArray gene, int min, int max)
        {
            var x = BinaryToInt(gene);
            var space = max - min;
            var k = gene.Length;
            var real = x * space / (Math.Pow(2, k) - 1) + min;
            return Math.Round(real, 1);
        }

        public static int BinaryToInt(BitArray gene)
        {
            var result = 0;
            for (var alleloPosition = 0; alleloPosition < gene.Length; alleloPosition++)
            {
                result += (gene.Get(alleloPosition) ? 1 : 0) * ((int)Math.Pow(2, (gene.Length - alleloPosition - 1)));
            }
            return result;
        }

        public static BitArray IntToBinary(int numberToConvert)
        {
            var rests = new List<int>();

            while (numberToConvert > 0)
            {
                rests.Add((int)Math.Truncate(numberToConvert % 2.0));
                numberToConvert = (int)Math.Truncate(numberToConvert / 2.0);
            }

            var size = (int)Math.Ceiling(rests.Count/4.0);

            var ret = new BitArray((size == 0 ? 1 : size) * 4, false);

            for (var i = 0; i < rests.Count; i++)
            {
                ret.Set(ret.Length - i -1, rests[i] == 1);
            }

            return ret;
        }

        public static string BitArrayToString(BitArray cromossomo)
        {
            var str = new StringBuilder();

            for (var pos = 0; pos < cromossomo.Length; pos++)
            {
                str.Append(cromossomo.Get(pos) ? 1 : 0);
            }

            return str.ToString();
        }
    }

    public class Program
    {
        static void Main(string[] args)
        {
            var experimentResults = new List<BitArray>();

            for(var experiment = 0 ; experiment< Parameters.NumberOfExperiments; experiment++)
                experimentResults.Add(RunExperimet());
            Console.WriteLine("Finished");
            Console.ReadLine();
        }

        private static BitArray RunExperimet()
        {
            var bestIndividualByGeneration = new List<BitArray>();
            var mediumFitnessByGeneration = new List<Double>();
            var worseIndividualByGeneration = new List<BitArray>();

            //População Inicial com Valores Aleatoreos
            var population = GetInitialPopulation();
            //Imprime a população inicial
            Console.WriteLine("--População Inicial--");
            population.ForEach(PrintIndividual);
            Console.WriteLine("--Fim População Inicial--");

            for (var generation = 0; generation < Parameters.MaxGenerations; generation++)
            {
                //Fitness
                var populationWithFitness = EvaluatePopulation(population).OrderByDescending(t=> t.Item2).ToList();

                bestIndividualByGeneration.Add(populationWithFitness.First().Item1);
                mediumFitnessByGeneration.Add(populationWithFitness.Average(tuple => tuple.Item2));
                worseIndividualByGeneration.Add(populationWithFitness.Last().Item1);

                if (OptimalValueReached(population)) 
                    break;

                var parents = GetParents(populationWithFitness);
                var offspring = GetOffsprings(parents);
                ApplyMutations(offspring);
                population = offspring;
            }

            //Imprime a população Final
            Console.WriteLine("--População Final--");
            population.ForEach(PrintIndividual);
            Console.WriteLine("--Fim População final--");

            PrintResults(bestIndividualByGeneration, worseIndividualByGeneration, mediumFitnessByGeneration);
            Console.ReadLine();
            return new BitArray(1);
        }

        public static void ApplyMutations(List<BitArray> offsprings)
        {
            var rdn = new Random((int) DateTime.Now.Ticks);

            foreach (var cromossome in offsprings)
            {
                for (var allele = 0; allele < cromossome.Length; allele++)
                {
                    var testNumber = rdn.NextDouble();
                    var apply = testNumber < (Parameters.MutationFactior / cromossome.Length);
                    if (apply)
                        cromossome.Set(allele, !cromossome.Get(allele));
                }
            }
        }

        private static List<BitArray> GetOffsprings(List<BitArray> parents)
        {
            var offsprings = new List<BitArray>();
            var rdn = new Random((int) DateTime.Now.Ticks);
            for (var pos = 0; pos < parents.Count; pos+=2)
            {
                var parent1 = parents[pos];
                var parent2 = parents[pos+1];

                var decent1 = new BitArray(parent1.Length);
                var decent2 = new BitArray(parent1.Length);

                for (var i = 0; i < decent1.Length; i++)
                {
                    decent1[i] = rdn.Next(0, 100)%2 == 0 ? parent1[i] : parent2[i];
                    decent2[i] = rdn.Next(0, 100)%2 == 0 ? parent1[i] : parent2[i];
                }
                offsprings.Add(decent1);
                offsprings.Add(decent2);
            }

            return offsprings;
        }

        private static List<BitArray> GetParents(List<Tuple<BitArray, double>> populationWithFitness)
        {
            var roulette = new List<BitArray>();
            var sumValues = populationWithFitness.Sum(i => i.Item2);
            var rdn = new Random(DateTime.Now.Millisecond);

            var numOfParents = (int)(populationWithFitness.Count*Parameters.CrossOverFactor);
          
            for  (var i = 0; i < numOfParents; i++)
            {
                var tuple = populationWithFitness[i];
                var proportional = (int) (tuple.Item2/sumValues*100);

                for (var rep = 0; rep < (proportional == 0 ? 1 : proportional); rep++)
                    roulette.Add(tuple.Item1);
            }

            var selectedParents = new List<BitArray>();

            while (selectedParents.Count < Parameters.NumberOfIndividuals)
            {
                var selectedParent = roulette[rdn.Next(0, roulette.Count - 1)];

                selectedParents.Add(selectedParent);
            }

            return selectedParents;
        }

        public static bool OptimalValueReached(List<BitArray> population)
        {
            var result = true;
            
            foreach (var individual in population)
            {
                for (var i = 0; i < Parameters.NumberOfDimensions; i++)
                {
                    var binaryGene = ExtractBinaryGen(individual, i);
                    var realGene = Converters.ConvertGenToReal(binaryGene, Parameters.MinReal, Parameters.MaxReal);
                    result = result && Parameters.OptimalValue[i] == realGene;
                }
                if (!result)
                    return false;
            }
            return true;
        }

        private static List<BitArray> GetInitialPopulation()
        {
            var initialPopulation = new List<BitArray>();
            var rdn = new Random();

            for (var i = 0; i < Parameters.NumberOfIndividuals; i++)
            {
                var binarySize = Converters.IntToBinary(Parameters.MaxReal - Parameters.MinReal).Length;

                var cromossome = new BitArray(binarySize * Parameters.NumberOfDimensions, false);

                for (var allele = 0; allele < cromossome.Length; allele++)
                {
                    //se par adiciona 1, se impar adiciona 0
                    var bit = rdn.Next(0, 100)%2 == 0;

                    cromossome.Set(allele, bit);
                }

                initialPopulation.Add(cromossome);
            }

            return initialPopulation;
        }

        public static List<double> GetPopulationFitness(List<BitArray> population)
        {
            var fitness = new List<double>();

            foreach (var inidividual in population)
            {
                var sum = 0.0;
                for (var i = 0; i < Parameters.NumberOfDimensions; i++)
                {
                    var binaryGene = ExtractBinaryGen(inidividual, i);
                    var realGene = Converters.ConvertGenToReal(binaryGene, Parameters.MinReal, Parameters.MaxReal);

                    //sum += Math.Abs(Parameters.OptimalValue[i] - realGene); -- Minha Solução
                    sum += Math.Abs(realGene*Math.Sin(realGene) + 0.1*realGene); //Alpine01
                }
                //fitness.Add((Parameters.MaxReal - Parameters.MinReal) - sum / Parameters.NumberOfDimensions);-- Minha Solução
                fitness.Add((Parameters.MaxReal - Parameters.MinReal) - sum); //inverto o cara para que o mais apto tenha a maior nota e o menos apto a menor nota
            }
            return fitness;
        }

        public static List<Tuple<BitArray, double>> EvaluatePopulation(List<BitArray> originalPopulation)
        {
            var populationFitness = GetPopulationFitness(originalPopulation);

            var scored = new List<Tuple<BitArray,double>>();
            for (var i = 0; i < originalPopulation.Count; i++)
            {
                var individual = originalPopulation[i];
                var fitness = populationFitness[i];

                scored.Add(new Tuple<BitArray, double>(individual, fitness));
            }

            return scored;
        }
        #region Aux
        private static void PrintIndividual(BitArray individual)
        {
            for (var i = 0; i < Parameters.NumberOfDimensions; i++)
            {                
                var binaryGene = ExtractBinaryGen(individual, i);
                var realGene = Converters.ConvertGenToReal(binaryGene, Parameters.MinReal, Parameters.MaxReal);
                Console.Write(realGene.ToString("#0.0"));
                Console.Write(";");
            }
            Console.Write("I[");
            Console.Write(Converters.BitArrayToString(individual));
            Console.Write("]");
            Console.WriteLine();
        }

        public static BitArray ExtractBinaryGen(BitArray cromossome, int genNumber)
        {
            var size = Converters.IntToBinary(Parameters.MaxReal - Parameters.MinReal).Length;

            var binaryGen = new BitArray(size);

            for (var alleloPosition = 0; alleloPosition < size; alleloPosition++)
            {
                binaryGen.Set(alleloPosition, cromossome.Get(alleloPosition + (genNumber * size)));
            }

            return binaryGen;
        }

        private static void PrintResults(List<BitArray> bests, List<BitArray> worses, List<double> medium)
        {
            var fitnessForWinners = EvaluatePopulation(bests);
            var fitnessForLosers = EvaluatePopulation(worses);
            Console.WriteLine("Gen;Best;Worse;Medium");
            for (int i = 0; i < fitnessForWinners.Count; i++)
            {
                Console.WriteLine("{0};{1};{2};{3}", i,
                    fitnessForWinners[i].Item2,
                    fitnessForLosers[i].Item2,
                    medium[i]);
            }
        }
        #endregion
    }
}
