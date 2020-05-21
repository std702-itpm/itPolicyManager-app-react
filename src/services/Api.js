import Axios from 'axios';

class Api {

    fetchCompanyByName(name) {
        return Axios.get("http://localhost:5000/company", {
            params: {
                name: name,
                type: "company"
            }
        });
    }

    fetchSubscribedPolicies(companyId, policyId) {
        return Axios.get("http://localhost:5000/getSubscribedPolicy", {
            params: {
                company_id: companyId,
                policy_id: policyId
            }
        })
    }

    fetchSubscribedPolicy(policyId) {
        return Axios.get("http://localhost:5000/getSubscribedPolicy", {
            params: {
                policy_type: "one",
                policy_id: policyId
            }
        })
    }
}

export default Api;