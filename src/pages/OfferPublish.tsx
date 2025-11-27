import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PublishStepper } from "@/components/publish/PublishStepper";

export type PublishStatus = "pending" | "processing" | "done" | "failed";

export interface PublishStep {
  id: string;
  label: string;
  status: PublishStatus;
}

const OfferPublish = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [steps, setSteps] = useState<PublishStep[]>([
    { id: "validate", label: "Validating Fields", status: "pending" },
    { id: "send", label: "Sending Draft to Partner Center", status: "pending" },
    { id: "create", label: "Creating Offer on Partner Center", status: "pending" },
    { id: "complete", label: "Offer Created on Partner Center", status: "pending" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const updatedSteps = [...prevSteps];
        const nextIncompleteIndex = updatedSteps.findIndex(
          step => step.status !== "done" && step.status !== "failed"
        );

        if (nextIncompleteIndex !== -1) {
          updatedSteps[nextIncompleteIndex].status = "processing";
          setCurrentStep(nextIncompleteIndex);

          setTimeout(() => {
            setSteps(currentSteps => {
              const finalSteps = [...currentSteps];
              finalSteps[nextIncompleteIndex].status = "done";
              return finalSteps;
            });
          }, 1500);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/offer/draft-created/${offerId}`);
          }, 1000);
        }

        return updatedSteps;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate, offerId]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Creating Draft on Partner Center</h1>
          <p className="text-muted-foreground">
            Please wait while we create your offer draft on Microsoft Partner Center
          </p>
        </div>

        <PublishStepper steps={steps} currentStep={currentStep} />
      </div>
    </Layout>
  );
};

export default OfferPublish;
