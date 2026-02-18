import { useState } from 'react';

function BatchProcessor() {
  const [specInput, setSpecInput] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const processSpecs = async () => {
    if (!specInput.trim()) {
      alert('Please paste spec sheet text!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specInput: specInput,
        }),
      });

      const data = await response.json();

      // Log the response for debugging
      console.log('API Response:', data);

      // Check for errors
      if (data.error) {
        alert(`Error: ${data.error}`);
        setLoading(false);
        return;
      }

      // Check if content exists
      if (!data.content || !data.content[0]) {
        alert('Unexpected response format from API');
        console.error('Response data:', data);
        setLoading(false);
        return;
      }

      let responseText = data.content[0].text.trim();

      // Remove markdown code blocks if present
      responseText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsedProducts = JSON.parse(responseText);
      setProducts(parsedProducts);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing specs. Check console for details.');
    }

    setLoading(false);
  };

  const exportToCSV = () => {
    if (products.length === 0) return;

    const headers = [
      'Product Code',
      'Collection',
      'Type',
      'Description',
      'Finish',
    ];
    const rows = products.map((p) => [
      p.productCode,
      p.collection,
      p.productType,
      p.description,
      p.finish,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const copyDescription = (desc: string) => {
    navigator.clipboard.writeText(desc);
    alert('Description copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Batch Spec Sheet Processor
          </h1>
          <p className="text-gray-600">
            Paste spec sheets → AI extracts → Generate descriptions 🚀
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            📋 Paste Spec Sheet Text (Multiple Products OK!)
          </label>
          <textarea
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            placeholder="Paste spec sheet text here... can include multiple products!

Example:
APOLLO WITH APOLLO LEVER FAUCET SET 2020BSN801-XX
Available in all finishes
3-hole installation 8-16 inch
Includes push drain assembly
Chrome, Brushed Nickel, etc."
            className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
          />

          <div className="mt-4 flex gap-4">
            <button
              onClick={processSpecs}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                '🤖 Process with AI'
              )}
            </button>

            <button
              onClick={() => {
                setSpecInput('');
                setProducts([]);
              }}
              className="px-8 bg-gray-600 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-all"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tips:</strong> Paste text from PDFs, websites, or
              Excel. Include product names, features, finishes. The AI will
              extract everything and generate proper descriptions following your
              company rules!
            </p>
          </div>
        </div>

        {/* Results Table */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                📦 Generated Products ({products.length})
              </h2>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
              >
                📥 Export to CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="p-4 text-left font-semibold">Code</th>
                    <th className="p-4 text-left font-semibold">Collection</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Description</th>
                    <th className="p-4 text-left font-semibold">Finish</th>
                    <th className="p-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4 font-mono text-sm font-bold text-blue-700">
                        {product.productCode}
                      </td>
                      <td className="p-4 font-semibold">
                        {product.collection}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {product.productType}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {product.description}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                          {product.finish}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => copyDescription(product.description)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold"
                        >
                          📋 Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-700">
                  {products.length}
                </div>
                <div className="text-sm text-blue-600 font-semibold">
                  Products Generated
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <div className="text-3xl font-bold text-purple-700">
                  {new Set(products.map((p) => p.collection)).size}
                </div>
                <div className="text-sm text-purple-600 font-semibold">
                  Collections
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <div className="text-3xl font-bold text-green-700">
                  {new Set(products.map((p) => p.finish)).size}
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  Finishes
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchProcessor;
