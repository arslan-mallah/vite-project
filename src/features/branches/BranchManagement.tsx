import { useState, useEffect } from 'react';
import { branchService, companyService } from '../../core/services/example.service';
import { PageWrapper } from '../../core/components/PageWrapper';

interface Branch {
  id: string;
  company_id: string;
  name: string;
  code: string;
  city?: string;
  is_main: boolean;
}

interface Company {
  id: string;
  name: string;
}

/**
 * Branch Management Component
 */
export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    code: '',
    city: '',
    is_main: false,
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  // Fetch all branches
  const handleGetAllBranches = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await branchService.getAllBranches();
      setBranches(data);
      console.log('Branches fetched:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create branch
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newBranch = await branchService.createBranch({
        company_id: formData.company_id,
        name: formData.name,
        code: formData.code,
        city: formData.city || undefined,
        is_main: formData.is_main,
      });
      setBranches([...branches, newBranch]);
      setFormData({ company_id: '', name: '', code: '', city: '', is_main: false });
      console.log('Branch created:', newBranch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete branch
  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    setLoading(true);
    setError('');
    try {
      await branchService.deleteBranch(id);
      setBranches(branches.filter(b => b.id !== id));
      console.log('Branch deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  };

  return (
    <PageWrapper>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Branch Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage branches for your companies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Branch Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create Branch</h2>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company
                  </label>
                  <select
                    value={formData.company_id}
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_main}
                    onChange={(e) => setFormData({ ...formData, is_main: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Is Main Branch
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Branch'}
                </button>
              </form>
            </div>

            {/* Branches List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Branches</h2>
                <button
                  onClick={handleGetAllBranches}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load Branches'}
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {branches.map((branch) => (
                  <div key={branch.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{branch.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Code: {branch.code}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Company: {getCompanyName(branch.company_id)}</p>
                        {branch.city && <p className="text-sm text-slate-600 dark:text-slate-300">City: {branch.city}</p>}
                        {branch.is_main && <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">Main Branch</span>}
                      </div>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
