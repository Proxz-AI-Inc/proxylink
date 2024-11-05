'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Title, Text, Flex, ProgressBar } from '@tremor/react';
import { Modal } from '@/components/ui/';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTenant, updateTenant } from '@/lib/api/tenant';
import { CustomerInfoField, RequestType } from '@/lib/db/schema';
import AUTH_FIELDS from '@/constants/authFields.json';
import { getArticle } from '@/lib/api/article';
import { Loader } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import OrgOnboardingWizardFooter from './OrgOnboardingWizardFooter';
import { PROVIDER_STEPS, PROXY_STEPS } from './config';

const OrgOnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();

  const { data: org } = useQuery({
    queryKey: ['organization', userData?.tenantId],
    queryFn: () => getTenant(userData?.tenantId),
    enabled: !!userData?.tenantId,
  });

  useEffect(() => {
    if (org?.active === false && userData?.role === 'admin') {
      setIsOpen(true);
    }
    if (org?.requiredCustomerInfo) {
      setAuthFields(org.requiredCustomerInfo);
    }
    if (org?.requestTypes) {
      setRequestTypes(org.requestTypes);
    }
  }, [org, userData?.role]);

  const [authFields, setAuthFields] = useState<string[]>([]);

  const { data: termsConditionsArticle, isLoading: isTermsLoading } = useQuery({
    queryKey: ['terms-and-conditions'],
    queryFn: () => getArticle('terms-and-conditions'),
  });

  const [termsConditionsAccepted, setTermsConditionsAccepted] = useState(false);

  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);

  const steps =
    userData?.tenantType === 'provider' ? PROVIDER_STEPS : PROXY_STEPS;

  const getTotalSteps = useCallback(() => {
    return Object.keys(steps).length;
  }, [steps]);

  const getCurrentProgress = useCallback(() => {
    const totalSteps = getTotalSteps();
    return (step / totalSteps) * 100;
  }, [step, getTotalSteps]);

  const getNextStep = useCallback(
    (currentStep: number) => {
      return steps[currentStep]?.nextStep ?? currentStep;
    },
    [steps],
  );

  const getPreviousStep = useCallback(
    (currentStep: number) => {
      return steps[currentStep]?.prevStep ?? currentStep;
    },
    [steps],
  );

  const renderStep = () => {
    const currentStep = steps[step];

    switch (currentStep.title) {
      case 'Welcome':
        return (
          <>
            <h3 className="text-3xl">Let&apos;s get you set up</h3>
            <p className="text-center">
              {userData?.tenantType === 'provider'
                ? 'The onboarding process for your organization includes setting up authenticating fields, confirming request types, and accepting terms and conditions.'
                : 'The onboarding process for your organization includes accepting terms and conditions.'}
            </p>
          </>
        );
      case 'Auth Fields':
        if (userData?.tenantType !== 'provider') return null;
        return (
          <div className="flex flex-col h-full">
            <h3 className="text-3xl mb-4">Confirm Authenticating Fields</h3>
            <p className="text-left mb-4">
              Please confirm the information you require to authenticate your
              customers. Proxies will be required to provide this information
              when submitting a request.
            </p>
            <div
              className="flex-grow overflow-y-auto mb-4"
              style={{ maxHeight: 'calc(80vh - 300px)' }}
            >
              <div className="space-y-2 flex flex-col w-full">
                {AUTH_FIELDS.map(item => (
                  <label key={item.field} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={item.field}
                      checked={authFields.includes(item.field)}
                      onChange={e => {
                        if (e.target.checked) {
                          setAuthFields([...authFields, item.field]);
                        } else {
                          setAuthFields(
                            authFields.filter(f => f !== item.field),
                          );
                        }
                      }}
                    />
                    <span className="ml-2">{item.display}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Request Types':
        if (userData?.tenantType !== 'provider') return null;
        const handleRequestTypeChange = (type: RequestType) => {
          if (requestTypes.includes(type)) {
            setRequestTypes(requestTypes.filter(t => t !== type));
          } else {
            setRequestTypes([...requestTypes, type]);
          }
        };
        return (
          <div className="flex flex-col h-full">
            <h3 className="text-3xl mb-4">Confirm Request Types</h3>
            <p className="text-left mb-4">
              Please select the types of requests you want to receive from proxy
              users.
            </p>
            <div
              className="flex-grow overflow-y-auto mb-4"
              style={{ maxHeight: 'calc(80vh - 300px)' }}
            >
              <div className="space-y-2 flex flex-col w-full">
                {['Cancellation', 'Discount'].map(type => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={type}
                      checked={requestTypes.includes(type as RequestType)}
                      onChange={() =>
                        handleRequestTypeChange(type as RequestType)
                      }
                    />
                    <span className="ml-2">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Terms & Conditions':
        if (isTermsLoading) return <Loader />;
        return (
          <div className="flex flex-col h-full">
            <h3 className="text-3xl mb-4 text-center">
              {termsConditionsArticle?.title}
            </h3>
            <div
              className="flex-grow overflow-y-auto mb-4"
              style={{ height: 'calc(80vh - 200px)' }}
            >
              <div
                className="text-base leading-normal hygraph-content"
                dangerouslySetInnerHTML={{
                  __html: termsConditionsArticle?.body?.html ?? '',
                }}
              />
            </div>
            <div className="mt-auto">
              <div className="flex space-x-2 w-full mt-4">
                <Checkbox
                  checked={termsConditionsAccepted}
                  onChange={() =>
                    setTermsConditionsAccepted(!termsConditionsAccepted)
                  }
                />
                <Text>Please accept our terms and conditions.</Text>
              </div>
            </div>
          </div>
        );
      case 'Congratulations':
        return (
          <>
            <div className="text-6xl">🎉</div>
            <Title>Congratulations!</Title>
            <p className="text-center">
              You successfully completed the onboarding process for{' '}
              <span>{userData?.tenantName}</span> organization on ProxyLink.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const activateTenantMutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      setStep(currStep => currStep + 1);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAcceptTerms = async () => {
    if (!org) {
      console.error('Organization not found');
      return;
    }
    await activateTenantMutation.mutate({
      ...org,
      active: true,
      ...(userData?.tenantType === 'provider'
        ? {
            requiredCustomerInfo: authFields as CustomerInfoField[],
            requestTypes: requestTypes,
          }
        : {}),
    });
  };

  if (!userData || !org || !termsConditionsArticle) return null;

  return (
    <Modal
      shown={isOpen}
      title=""
      size="lg"
      footer={
        <OrgOnboardingWizardFooter
          step={step}
          totalSteps={getTotalSteps()}
          onNext={() => setStep(getNextStep(step))}
          onPrevious={() => setStep(getPreviousStep(step))}
          onFinish={() => setIsOpen(false)}
          isLastStep={step === getTotalSteps()}
          isFirstStep={step === 1}
          termsAccepted={termsConditionsAccepted}
          onAcceptTerms={handleAcceptTerms}
          isLoading={activateTenantMutation.isPending}
        />
      }
    >
      <Card className="w-full max-h-[80vh] h-full flex flex-col overflow-hidden p-0">
        <Flex
          flexDirection="col"
          alignItems="center"
          justifyContent="start"
          className="h-full"
        >
          <ProgressBar
            value={getCurrentProgress()}
            className="w-full mb-6"
            color="indigo"
          />
          <div className="w-full overflow-y-auto flex-grow flex flex-col items-center gap-4 p-4">
            {renderStep()}
          </div>
        </Flex>
      </Card>
    </Modal>
  );
};

export default OrgOnboardingWizard;
