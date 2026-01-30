import React, { useEffect, useState } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

const CompanyDashboard: React.FC = () => {
    const [companyName, setCompanyName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [currentCompany, setCurrentCompany] = useState<string>('');
    const [currentDescription, setCurrentDescription] = useState<string>('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const notyf = new Notyf({
        position: { x: 'right', y: 'top' },
        duration: 5000,
    });

    useEffect(() => {
        document.title = 'QR instruction Dashboard';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);

            return () => clearTimeout(timer);
        }
        const fetchAPI = async () => {
                    try {
                        const response = await axios.get(`/api/method/reward_management.api.company_address.get_company_address`);
        
                        if (response.data.message) {
                            const data = response.data.message;
                            // console.log("company data", data);
        
                            setCurrentCompany(data.company_name);
                            setCurrentDescription(data.description || '');
                            
                        }
                    } catch (error) {
                        console.error('Error fetching company address:', error);
                    }
                };
        
                fetchAPI();
    }, [showSuccessAlert]);

    useEffect(() => {
            if (currentCompany && currentDescription) {
                setCompanyName(currentCompany);
                setDescription(currentDescription);
            }
        }, [currentCompany, currentDescription]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!companyName.trim() || !description.trim()) {
            notyf.error('Please fill in all fields correctly.');
            return;
        }

        try {
            const response = await axios.post(
                '/api/method/reward_management.api.company_address.add_or_update_company_name_description',
                {
                    company_name: companyName,
                    description: description,
                }
            );

            if (response.data && response.data.message.success === true) {
                setShowSuccessAlert(true);
            } else {
                notyf.error('Failed to create company. Please try again.');
            }
        } catch (error) {
            console.error(error);
            notyf.error('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Pageheader currentpage={"QR instruction"} />

            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6 w-full max-w-md">
                        
                        <div className="box-header text-center">
                            <div className="box-title text-1rem font-semibold text-primary">
                                Set QR instruction
                            </div>
                        </div>

                        <div className="box-body mt-4">
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control w-full !rounded-md !bg-light text-xs"
                                        placeholder="Enter company name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Description (Long Text) */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control w-full !rounded-md !bg-light text-xs"
                                        placeholder="Enter company description"
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                 <div className='xl:col-span-12 col-span-12 text-center flex justify-between gap-5'>
                                            <button
                                                type="submit"
                                                className="ti-btn text-white w-full bg-primary"
                                                // disabled={!!emailError || !!websiteError || mobileErrors.some(err => err)}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="ti-btn text-defaulttextcolor w-full bg-primary/20"
                                                onClick={() => window.location.reload()}
                                            >
                                                Cancel
                                            </button>
                                        </div>

                            </form>
                        </div>

                        {showSuccessAlert && <SuccessAlert message="QR instruction added successfully!" />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyDashboard;
