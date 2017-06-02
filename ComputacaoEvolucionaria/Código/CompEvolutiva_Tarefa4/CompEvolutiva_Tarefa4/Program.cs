using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace CompEvolutiva_Tarefa4
{
    public static class Parameters
    {
        public static int NumberOfDimensions = 3;
        public static int PopulationSize = 100;
        public static int MaxGenerations = 100;
        public static int MaxReal = 5;
        public static int MinReal = -5;
        public static double MutationFactor = 0.1;
        public static TestType TestType = TestType.Kursawe;
    }
    
    public enum TestType { Kursawe, Binh4 }

    public class Solution
    {   
        public double[] Dimensions = new double[Parameters.NumberOfDimensions];

        //cache variables
        private int? _dominance = null;
        private double? _crowdingDistance = null;

        public int GetDominace(List<Solution> population)
        {
            if (_dominance.HasValue)
                return _dominance.Value;

            var me = this;
            var solutionsBetterThenMe = population.Count(otherSolution => 
                                                         otherSolution.F1() < me.F1() 
                                                      && otherSolution.F2() < me.F2());
            _dominance = solutionsBetterThenMe;
            return solutionsBetterThenMe;
        }

        public double GetCrowdingDistance(List<Solution> population)
        {
            if (_crowdingDistance.HasValue)
                return _crowdingDistance.Value;

            var front = population.Where(solution => 
                solution.GetDominace(population) == this.GetDominace(population))
                .OrderBy(solution => solution.F1())
                .ThenBy(solution => solution.F2())
                .ToList();

            var myPosition = front.IndexOf(this); //i
            var leftSolution = myPosition == 0 ?  front[myPosition] : front[myPosition - 1]; //i - 1; Testa se sou o primeiro
            var rightSolution = myPosition == front.Count - 1 ? front[myPosition] : front[myPosition + 1]; //i + 1; Testa se sou o último
                       

            var crowdingDistance =
                  (rightSolution.F1() - leftSolution.F1()) / (front.Max(f => f.F1()) - front.Min(f => f.F1()))
                + (leftSolution.F2() - rightSolution.F2()) / (front.Max(f => f.F2()) - front.Min(f => f.F2()));

            _crowdingDistance = crowdingDistance;

            return crowdingDistance;

        }
        
        //Reset cache
        public void ResetEvaluation()
        {
            _crowdingDistance = null;
            _dominance = null;
        }

        public double F1()
        {
            switch (Parameters.TestType)
            {
                    case TestType.Kursawe:
                        return KursaweFunction1();
                    break;
                    case TestType.Binh4:
                        return Binh4Function1();
                    break;
                    default:
                        throw new NotImplementedException();
            }
        }

        public double F2()
        {
            switch (Parameters.TestType)
            {
                case TestType.Kursawe:
                    return KursaweFunction2();
                    break;
                case TestType.Binh4:
                    return Binh4Function2();
                    break;
                default:
                    throw new NotImplementedException();
            }
        }

        #region Binh4 Front Test
        private double Binh4Function1()
        {
            var x = Dimensions[0];
            var 
                y = Dimensions[1];
            var score = Math.Pow(x, 2) - y;
            Penalyse(ref score);
            return score;
        }
        private double Binh4Function2()
        {
            var x = Dimensions[0];
            var y = Dimensions[1];
            var score = -0.5*x - y - 1;
            Penalyse(ref score);
            return score;
        }

        private void Penalyse(ref double currentScore)
        {
            var x = Dimensions[0];
            var y = Dimensions[1];
            var penaltyTestOne = 6.5 - (x/6) - y;
            var penaltyTestTwo = 7.5 - (0.5*x) - y;
            var penaltyTestThree = 30 - (5*x) - y;
            var deviatonScore = 0.0;

            if (penaltyTestOne < 0)
                deviatonScore += Math.Abs(penaltyTestOne);
            if (penaltyTestTwo < 0)
                deviatonScore += Math.Abs(penaltyTestTwo);
            if (penaltyTestThree < 0)
                deviatonScore += Math.Abs(penaltyTestThree);

            //adiciona o score de penalização pois o problema é de minimização, se não subitrairia
            currentScore += deviatonScore;
        }

        #endregion

        #region Kursawe Front Test
        private double KursaweFunction1()
        {
            var result = 0.0;
            for (var i = 0; i < 2; i++)
            {
                var expX1 = Math.Pow(Dimensions[i], 2);
                var expX2 = Math.Pow(Dimensions[i + 1], 2);
                var sqrX1X2 = Math.Sqrt(expX1 + expX2);
                var e = Math.Round(-0.2 * sqrX1X2, 2);
                result += -Math.Pow(10, e);
            }
            return result;
        }

        private double KursaweFunction2()
        {
            var result = 0.0;
            for (var i = 0; i < 3; i++)
            {
                result += Math.Pow(Math.Abs(Dimensions[i]), 0.8) + 5*Math.Sin(Math.Pow(Dimensions[i], 3));
            }
            return result;
        }
        #endregion

    }

    public class Program
    {
        private static int _currentGeneration;
     
        static void Main(string[] args)
        {
            Console.WriteLine("Selecione a questão da tarefa 4 a ser testada:");
            Console.WriteLine("1 - Teste de fronteira Kursawe");
            Console.WriteLine("2 - Teste de fronteira da Questão 2");

            var op = Console.ReadLine();

            //Não tem que fazer nada com o 1
            if (op == "2")
            {
                Parameters.TestType = TestType.Binh4;
                Parameters.MinReal = -7;
                Parameters.MaxReal = 4;
                Parameters.NumberOfDimensions = 2;
            }
            
            RunExperimet();
            Console.WriteLine("Finished");
            Console.ReadLine();
        }

        private static void RunExperimet()
        {
            
            //População Inicial com Valores Aleatoreos
            var population = GetInitialPopulation();

            //Imprime a população inicial
            Console.WriteLine("--Avaliação Inicial--\n");
            population.ForEach(i =>
            {
                Console.Write(i.GetDominace(population));
                Console.Write(";");
                PrintIndividual(i);
            }
                );
            Console.WriteLine("\n--Fim Avaliação Inicial--\n");

            for (_currentGeneration = 0; _currentGeneration < Parameters.MaxGenerations; _currentGeneration++)
            {
                Console.Write(".");
                //if (population.All(solution => solution.GetDominace(population) == 0))
                //    break;

                var parents = GetParents(population);
                var offspring = ApplyCrossOver(parents);
                ApplyMutations(offspring);
                var r = offspring.Union(population).ToList(); //R = Filhos + População Inicial
                population = GetFinalOffsprings(r);
                population.AsParallel().ForAll(solution => solution.ResetEvaluation());
            }
            Console.WriteLine();
            //Imprime a população Final
            Console.WriteLine("\n--Avaliação Final--\n");
            population.ForEach(i =>
            {
                Console.Write(i.GetDominace(population));
                Console.Write(";");
                PrintIndividual(i);
            }
    );
            Console.WriteLine("\n--Fim Avaliação final--\n");
            Console.ReadLine();
        }

        #region selection
        private static List<Solution> GetInitialPopulation()
        {
            var initialPopulation = new List<Solution>();
            var rdn = new Random();

            for (var i = 0; i < Parameters.PopulationSize; i++)
            {
                var solution = new Solution();

                for (var dimension = 0; dimension < Parameters.NumberOfDimensions; dimension++)
                {
                    const int adjustFactor = 100; //Usado para melhorar a disprsão como numero real
                    var initialValue = (double)rdn.Next(Parameters.MinReal * adjustFactor, Parameters.MaxReal * adjustFactor);
                    solution.Dimensions[dimension] = Math.Round((initialValue / adjustFactor), 1);
                }

                initialPopulation.Add(solution);
            }

            return initialPopulation;
        }

        private static List<Solution> ApplyCrossOver(List<Solution> parents)
        {
            var offsprings = new List<Solution>();
            var rdn = new Random((int)DateTime.Now.Ticks);

            for (var pos = 0; pos < parents.Count; pos += 2)
            {
                var parent1 = parents[pos];
                var parent2 = parents[pos + 1];

                var offspring1 = new Solution();
                var offspring2 = new Solution();

                //crossover aritimético completo
                for (var i = 0; i < Parameters.NumberOfDimensions; i++)
                {
                    var alpha = rdn.NextDouble(); //Número aleatório entre 0 e 1

                    offspring1.Dimensions[i] = Math.Round(alpha * parent1.Dimensions[i] + 
                                               (1 - alpha) * parent2.Dimensions[i], 1); // O¹ = aP¹+(1-a)P²
                    offspring2.Dimensions[i] = Math.Round(alpha * parent2.Dimensions[i] + 
                                               (1 - alpha) * parent1.Dimensions[i], 1); // O² = aP²+(1-a)P¹
                }

                offsprings.Add(offspring1);
                offsprings.Add(offspring2);
            }

            return offsprings;
        }

        private static List<Solution> GetParents(List<Solution> population)
        {
            var rdn = new Random(DateTime.Now.Millisecond);
            var numOfParents = (Parameters.PopulationSize);
            var parents = new List<Solution>();

            for (var i = 0; i < numOfParents; i++)
            {
                var pair = new Solution[2];

                pair[0] = population[rdn.Next(0, population.Count)];
                pair[1] = population[rdn.Next(0, population.Count)];                

                parents.Add(
                            pair.OrderBy(p => p.GetDominace(population)) //Melhor Grau de Dominancia
                                .ThenByDescending(p => p.GetCrowdingDistance(population)) //Maior Distancia de Aglomeração
                                .First() //Pega o primeiro (menor grau e maior distancia)
                           );
            }

            return parents;
        }

        private static List<Solution> GetFinalOffsprings(List<Solution> r)
        {
            var orderedPopulation = r.OrderBy(solution => solution.GetDominace(r)) 
                                     //Ordena pelo grau de dominancia, menor (0) primeiro
                                     .ThenByDescending(solution => solution.GetCrowdingDistance(r)); 
                                    // Dentro do grau, ordena por aglomeração. Menores distancias ficam no final;


            var finalOffsprings = orderedPopulation.Take(Parameters.PopulationSize).ToList(); 
            /* Vai selecionar as primeiras fronteiras (com menor dominancia),
               discartando as fronteiras finais. 
             * Da ultima fronteira selecionada, vai elemina os com menor distancia de aglomeração */

            return finalOffsprings; //População Final com Tamanho N original
        }

        #endregion

        #region mutations
        public static void ApplyMutations(List<Solution> offsprings)
        {
            //FeedbackMutation(offsprings);
            UniformMutation(offsprings);
        }

        public static void UniformMutation(List<Solution> offsprings)
        {
            var rdn = new Random(DateTime.Now.Millisecond);

            foreach (var solution in offsprings)
            {
                if (rdn.NextDouble() > Parameters.MutationFactor) continue;

                var myIndex = offsprings.IndexOf(solution);
                var left = myIndex == 0 ? offsprings[myIndex] : offsprings[myIndex - 1];
                var right = myIndex == offsprings.Count -1 ? offsprings[myIndex] : offsprings[myIndex + 1];

                for (var dimension = 0; dimension < Parameters.NumberOfDimensions; dimension++)
                {
                    var leftValue = (int) left.Dimensions[dimension]*1000;
                    var rightValue = (int) right.Dimensions[dimension]*1000;
                    var minValue = leftValue < rightValue ? leftValue : rightValue;
                    var maxValue = leftValue > rightValue ? leftValue : rightValue;

                    var newValue = rdn.Next(minValue, maxValue) / 1000;
                    solution.Dimensions[dimension] = newValue;
                }
            }
        }

        public static void FeedbackMutation(List<Solution> offsprings)
        {
            var rdn = new Random((int)DateTime.Now.Ticks);
            var notMutatedPopulation = new List<Solution>(offsprings);
            var mutatedPopulation = new Dictionary<int, Solution>();

            for (var i = 0; i < offsprings.Count; i++)
            {
                for (var dimension = 0; dimension < offsprings[1].Dimensions.Length; dimension++)
                {
                    var testNumber = rdn.NextDouble();
                    var apply = testNumber < Parameters.MutationFactor;

                    if (apply)
                    {
                        offsprings[1].Dimensions[dimension] = rdn.Next(Parameters.MinReal, Parameters.MaxReal);
                        if (!mutatedPopulation.ContainsKey(i))
                            mutatedPopulation.Add(i, offsprings[1]);
                    }
                }
            }

            var successFactor = getMutationSuccessFactor(notMutatedPopulation, mutatedPopulation);

            if (successFactor > 0.2)
                Parameters.MutationFactor /= (rdn.Next(817, 1000) / 1000.0); //Numero aleatorio entre 0.817 e 1
            else if (successFactor < 0.2)
                Parameters.MutationFactor *= (rdn.Next(817, 1000) / 1000.0); //Numero aleatorio entre 0.817 e 1

        }

        private static double getMutationSuccessFactor(List<Solution> notMutatedPopulation, Dictionary<int, Solution> mutatedPopulation)
        {
            var totalMutated = mutatedPopulation.Count;
            var sucess = 0;

            if (totalMutated == 0)
                return 1;

            foreach (var mutant in mutatedPopulation)
            {
                var mutantEvaluation = mutant.Value.GetDominace(notMutatedPopulation);

                var originalEvaluation = notMutatedPopulation[mutant.Key].GetDominace(notMutatedPopulation);

                //se for melhor incrementa o sucesso
                if (mutantEvaluation < originalEvaluation)
                    sucess++;
            }
            return sucess / totalMutated;
        }
        #endregion

        #region Printers
        private static void PrintIndividual(double[] dimensions)
        {
            for (var i = 0; i < dimensions.Length; i++)
            {
                Console.Write(Math.Round(dimensions[i], 3).ToString("#0.000"));
                Console.Write(";");
            }
            Console.WriteLine();
        }

        private static void PrintIndividual(Solution individual)
        {
            Console.Write(Math.Round(individual.F1(), 3).ToString("#0.000"));
            Console.Write(";");
            Console.Write(Math.Round(individual.F2(), 3).ToString("#0.000"));
            Console.Write(";");
            Console.WriteLine();
        }

        #endregion
    }
}
