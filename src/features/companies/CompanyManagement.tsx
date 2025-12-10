import { useState } from 'react';
import { companyService } from '../../core/services/example.service';
import { PageWrapper } from '../../core/components/PageWrapper';

interface Company {
  id: string;
  name: string;
  cr_number?: string;
  cr_issue_date?: string;
}

/**
 * Company Management Component
 */
export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    cr_number: '',
    cr_issue_date: '',
  });

  // Fetch all companies
  const handleGetAllCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
      console.log('Companies fetched:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newCompany = await companyService.createCompany({
        name: formData.name,
        cr_number: formData.cr_number || undefined,
        cr_issue_date: formData.cr_issue_date || undefined,
      });
      setCompanies([...companies, newCompany]);
      setFormData({ name: '', cr_number: '', cr_issue_date: '' });
      console.log('Company created:', newCompany);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    setLoading(true);
    setError('');
    try {
      await companyService.deleteCompany(id);
      setCompanies(companies.filter(c => c.id !== id));
      console.log('Company deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
              Company Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage companies in your ERP system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Company Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create Company</h2>
              <form onSubmit={handleCreateCompany} className="space-y-4">
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
                    CR Number
                  </label>
                  <input
                    type="text"
                    value={formData.cr_number}
                    onChange={(e) => setFormData({ ...formData, cr_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CR Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.cr_issue_date}
                    onChange={(e) => setFormData({ ...formData, cr_issue_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </form>
            </div>

            {/* Companies List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Companies</h2>
                <button
                  onClick={handleGetAllCompanies}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load Companies'}
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {companies.map((company) => (
                  <div key={company.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{company.name}</p>
                      {company.cr_number && <p className="text-sm text-slate-600 dark:text-slate-300">CR: {company.cr_number}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
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
