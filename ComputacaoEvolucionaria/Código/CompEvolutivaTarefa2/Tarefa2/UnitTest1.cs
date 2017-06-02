using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CompEvolutivaTarefa2;


namespace Tarefa2
{
    [TestClass]
    public class UnitTest1
    {
        BitArray gene0 = new BitArray(new[] { false, false, false, false });
        BitArray gene7 = new BitArray(new[] { false, true, true, true });
        BitArray gene15 = new BitArray(new[] { true, true, true, true });
        BitArray gene31 = new BitArray(new[] { true, true, true, true, true });
        BitArray gene27 = new BitArray(new[] { false, false, false, true, true, false, true, true });

        [TestMethod]
        public void CanConvertBinaryToInt()
        {
            Assert.AreEqual(15, Converters.BinaryToInt(gene15));
            Assert.AreEqual(0, Converters.BinaryToInt(gene0));
            Assert.AreEqual(7, Converters.BinaryToInt(gene7));
            Assert.AreEqual(27, Converters.BinaryToInt(gene27));
        }

        [TestMethod]
        public void CanConvertCromossomeToReal()
        {
            Assert.AreEqual(1.1, Converters.ConvertGenToReal(gene27, 0, 10));
            Assert.AreEqual(-10.0, Converters.ConvertGenToReal(gene0, -10, 10));
            Assert.AreEqual(10.0, Converters.ConvertGenToReal(gene15, -10, 10));
            Assert.AreEqual(10.0, Converters.ConvertGenToReal(gene31, -10, 10));
        }

        [TestMethod]
        public void CanConvertIntToBinary()
        {
            var binary0 = Converters.IntToBinary(0);
            var binary7 = Converters.IntToBinary(7);
            var binary15 = Converters.IntToBinary(15);
            var binary27 = Converters.IntToBinary(27);
            
            for(var i=0; i < gene0.Length; i++)
                Assert.AreEqual(binary0.Get(i), gene0.Get(i));

            for (var i = 0; i < gene7.Length; i++)
                Assert.AreEqual(binary7.Get(i), gene7.Get(i));

            for (var i = 0; i < gene15.Length; i++)
                Assert.AreEqual(binary15.Get(i), gene15.Get(i));

            for (var i = 0; i < gene27.Length; i++)
                Assert.AreEqual(binary27.Get(i), gene27.Get(i));

        }

        [TestMethod]
        public void CanExtractCorrectBinayGen()
        {
            Parameters.MinReal = 0;
            Parameters.MaxReal = 15;

            var cromossome = new BitArray(new[] { false, true, true, true, false, true, true, true });
            var extractedGen0 = Program.ExtractBinaryGen(cromossome, 0);
            var extractedGen1 = Program.ExtractBinaryGen(cromossome, 1);

            Assert.IsFalse(extractedGen0.Get(0));
            Assert.IsTrue(extractedGen0.Get(1));
            Assert.IsTrue(extractedGen0.Get(2));
            Assert.IsTrue(extractedGen0.Get(3));

            Assert.IsFalse(extractedGen1.Get(0));
            Assert.IsTrue(extractedGen1.Get(1));
            Assert.IsTrue(extractedGen1.Get(2));
            Assert.IsTrue(extractedGen1.Get(3));
        }

        [TestMethod]
        public void CanConvertToString()
        {
            Assert.AreEqual(@"0111", Converters.BitArrayToString(gene7));
        }

        [TestMethod]
        public void canEvaluatePopulation()
        {
            var population = new List<BitArray>();
            population.Add(new BitArray(new[] { false, false, false, false, false, false, false, false }));
            population.Add(new BitArray(new[] { false, true, true, true, false, true, true, true }));
            population.Add(new BitArray(new[] { true, true, true, true, true, true, true, true }));

            var a = Program.EvaluatePopulation(population);

            Assert.AreEqual(Parameters.MaxReal, a[0].Item2);
            Assert.AreEqual(Parameters.MinReal, a[2].Item2);
        }

        [TestMethod]
        public void canReachedOptimalValue()
        {
            var population = new List<BitArray>();
            population.Add(new BitArray(new[] { false, false, false, false, false, false, false, false }));
            population.Add(new BitArray(new[] { false, true, true, true, false, true, true, true }));
            population.Add(new BitArray(new[] { true, true, true, true, true, true, true, true }));

            var b = Program.OptimalValueReached(population);

            Assert.IsTrue(b);
        }

        [TestMethod]
        public void canApplyMutation()
        {
            var geneTest = new BitArray(new[] { true, true, true, true });
            Parameters.MutationFactior = 4;

            Program.ApplyMutations(new List<BitArray> {geneTest});            
            Assert.AreNotEqual(Converters.BitArrayToString(geneTest), Converters.BitArrayToString(gene15));
        }
    }
}
