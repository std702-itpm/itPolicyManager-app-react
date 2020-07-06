import Axios from 'configs/AxiosConfig';

class Api {

    fetchCompanyByName(name) {
        return Axios.get("/company", {
            params: {
                name: name,
                type: "company"
            }
        });
    }

    /**
     * Fetches all available policies
     * @returns {Promise<AxiosResponse<any>>}
     */
    fetchAvailablePolicies() {
        return Axios.get("/getAllPolicies");
    }

    fetchSubscribedPoliciesByCompanyId(companyId) {
        return Axios.get("/getSubscribedPoliciesByCompanyId", {
            params: {
                company_id: companyId
            }
        })
    }

    fetchSubscribedPolicy(policyId) {
        return Axios.get("/getSubscribedPolicy", {
            params: {
                policy_id: policyId
            }
        })
    }

    submitPolicyReview(data){
        return Axios.post("/submitPolicyReview", data)
    }

    submitPolicyComment(data){
        return Axios.post("/policyComment", data)
    }

    fetchUserByCompanyId(companyId){
        return Axios.get("/user", {
            params: {
                companyId: companyId
            }
        })
    }
}

export default Api;