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

    fetchSubscribedPolicies(companyId, policyId) {
        return Axios.get("/getSubscribedPolicy", {
            params: {
                company_id: companyId,
                policy_id: policyId
            }
        })
    }

    fetchSubscribedPolicy(policyId) {
        return Axios.get("/getSubscribedPolicy", {
            params: {
                policy_type: "one",
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