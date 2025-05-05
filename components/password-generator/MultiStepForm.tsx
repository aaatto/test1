// File: components/password-generator/MultiStepForm.tsx (CSS Module Version - Verified)
"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ArrowRight, Send, Copy, Loader2, RefreshCw, AlertCircle, Check, Circle } from 'lucide-react';
import styles from './MultiStepForm.module.css'; // Import the CSS Module

// Define the structure for the form data
interface FormData {
  fullName: string; birthDay: string; commonNumbers: string; commonSymbols: string; commonWords: string; capitalizeWords: 'yes' | 'no' | 'sometimes'; replaceLetters: 'yes' | 'no' | 'sometimes'; passwordTestInput: string; otherInfo: string;
}

const steps = [
  { id: 1, title: 'Personal Basics', fields: ['fullName', 'birthDay'] }, { id: 2, title: 'Common Elements', fields: ['commonNumbers', 'commonSymbols', 'commonWords'] }, { id: 3, title: 'Habits', fields: ['capitalizeWords', 'replaceLetters'] }, { id: 4, title: 'Password Style Test', fields: ['passwordTestInput'] }, { id: 5, title: 'Other Clues', fields: ['otherInfo'] }, { id: 6, title: 'Review & Submit', fields: [] },
];
const TOTAL_STEPS = steps.length;

const NotAvailable = () => <span className={styles.naValue}>N/A</span>;

export default function MultiStepForm() {
  const { data: session, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '', birthDay: '', commonNumbers: '', commonSymbols: '', commonWords: '', capitalizeWords: 'no', replaceLetters: 'no', passwordTestInput: '', otherInfo: '',
   });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const passwordTestElements = ['apple', '73', '$', 'Run', 'kEy', '!', '2025', 'bOOk'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleRadioChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as 'yes' | 'no' | 'sometimes' }));
  };

  const handleSubmit = async () => {
    setIsLoading(true); setError(null); setSuggestions(null); setShowResults(true); console.log("Submitting Form Data:", formData);
    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || `HTTP error! status: ${response.status}`); }
      setSuggestions(data.suggestions || []);
      await updateSession({ credits: data.remainingCredits });
    } catch (err: any) { console.error("API Call failed:", err); setError(err.message || 'An unexpected error occurred.'); setSuggestions(null); } finally { setIsLoading(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { console.log('Password copied to clipboard'); }).catch(err => { console.error('Failed to copy password: ', err); });
  };
  const handleResetForm = () => {
      setCurrentStep(1); setFormData({ fullName: '', birthDay: '', commonNumbers: '', commonSymbols: '', commonWords: '', capitalizeWords: 'no', replaceLetters: 'no', passwordTestInput: '', otherInfo: '', }); setError(null); setSuggestions(null); setShowResults(false); setIsLoading(false);
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  // Render content for the current step using CSS Modules
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div>
              <label htmlFor="fullName" className={styles.label}>Full Name (or parts you might use)</label>
              <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g., John Doe, JD, Johnny" className={styles.input} disabled={isLoading}/>
            </div>
            <div>
              <label htmlFor="birthDay" className={styles.label}>Birth Date (or significant date)</label>
              <input id="birthDay" name="birthDay" type="date" value={formData.birthDay} onChange={handleInputChange} className={styles.input} disabled={isLoading}/>
              <p className={styles.inputDescription}>Format helps (e.g., YYYYMMDD, MMDDYY).</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <label htmlFor="commonNumbers" className={styles.label}>Common Numbers</label>
              <input id="commonNumbers" name="commonNumbers" value={formData.commonNumbers} onChange={handleInputChange} placeholder="e.g., 123, 7, 1990" className={styles.input} disabled={isLoading}/>
               <p className={styles.inputDescription}>House numbers, lucky numbers, years.</p>
            </div>
            <div>
              <label htmlFor="commonSymbols" className={styles.label}>Common Symbols</label>
              <input id="commonSymbols" name="commonSymbols" value={formData.commonSymbols} onChange={handleInputChange} placeholder="e.g., !, @, #, $" className={styles.input} disabled={isLoading}/>
            </div>
             <div>
              <label htmlFor="commonWords" className={styles.label}>Common Words/Phrases</label>
              <textarea id="commonWords" name="commonWords" value={formData.commonWords} onChange={handleInputChange} placeholder="e.g., pet names, hobbies, places (one per line or separated by commas)" className={styles.textarea} disabled={isLoading}/>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className={styles.radioGroup}>
              <label className={styles.label}>Do you usually capitalize words?</label>
              <label htmlFor="cap-no" className={styles.radioItem}>
                <input type="radio" id="cap-no" name="capitalizeWords" value="no" checked={formData.capitalizeWords === 'no'} onChange={(e) => handleRadioChange('capitalizeWords', e.target.value)} disabled={isLoading} />
                <span className={styles.radioPrimitive}>{formData.capitalizeWords === 'no' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                <span>No</span>
              </label>
              <label htmlFor="cap-yes" className={styles.radioItem}>
                 <input type="radio" id="cap-yes" name="capitalizeWords" value="yes" checked={formData.capitalizeWords === 'yes'} onChange={(e) => handleRadioChange('capitalizeWords', e.target.value)} disabled={isLoading} />
                 <span className={styles.radioPrimitive}>{formData.capitalizeWords === 'yes' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                 <span>Yes (e.g., First letter, ALL CAPS)</span>
              </label>
              <label htmlFor="cap-sometimes" className={styles.radioItem}>
                 <input type="radio" id="cap-sometimes" name="capitalizeWords" value="sometimes" checked={formData.capitalizeWords === 'sometimes'} onChange={(e) => handleRadioChange('capitalizeWords', e.target.value)} disabled={isLoading} />
                 <span className={styles.radioPrimitive}>{formData.capitalizeWords === 'sometimes' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                 <span>Sometimes / Specific words only</span>
              </label>
            </div>
             <div className={styles.radioGroup}>
              <label className={styles.label}>Do you replace letters with numbers/symbols?</label>
               <label htmlFor="rep-no" className={styles.radioItem}>
                  <input type="radio" id="rep-no" name="replaceLetters" value="no" checked={formData.replaceLetters === 'no'} onChange={(e) => handleRadioChange('replaceLetters', e.target.value)} disabled={isLoading} />
                  <span className={styles.radioPrimitive}>{formData.replaceLetters === 'no' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                  <span>No</span>
               </label>
               <label htmlFor="rep-yes" className={styles.radioItem}>
                  <input type="radio" id="rep-yes" name="replaceLetters" value="yes" checked={formData.replaceLetters === 'yes'} onChange={(e) => handleRadioChange('replaceLetters', e.target.value)} disabled={isLoading} />
                  <span className={styles.radioPrimitive}>{formData.replaceLetters === 'yes' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                  <span>Yes (e.g., E {'->'} 3, S {'->'} $, O {'->'} 0)</span>
               </label>
                <label htmlFor="rep-sometimes" className={styles.radioItem}>
                   <input type="radio" id="rep-sometimes" name="replaceLetters" value="sometimes" checked={formData.replaceLetters === 'sometimes'} onChange={(e) => handleRadioChange('replaceLetters', e.target.value)} disabled={isLoading} />
                   <span className={styles.radioPrimitive}>{formData.replaceLetters === 'sometimes' && <span className={styles.radioIndicator}><Circle /></span>}</span>
                   <span>Sometimes / Specific replacements</span>
                </label>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <label className={styles.label}>Password Style Test</label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-color)', marginBottom: '0.5rem' }}>Create a password using ONLY some or all of these elements:</p>
            <div className={styles.passwordTestElements}>
              {passwordTestElements.map((el, index) => <span key={index}>{el}</span>)}
            </div>
            <input id="passwordTestInput" name="passwordTestInput" value={formData.passwordTestInput} onChange={handleInputChange} placeholder="Enter your created password here" className={styles.input} disabled={isLoading}/>
            <p className={styles.inputDescription} style={{marginTop:'0.25rem'}}>This helps the AI understand your combination style.</p>
          </>
        );
      case 5:
        return (
          <>
            <label htmlFor="otherInfo" className={styles.label}>Any other important words, names, or patterns?</label>
            <textarea id="otherInfo" name="otherInfo" value={formData.otherInfo} onChange={handleInputChange} placeholder="e.g., 'Always end with 123', 'Favorite color blue', 'Middle name Smith'" rows={4} className={styles.textarea} disabled={isLoading}/>
            <p className={styles.inputDescription}>More clues can improve suggestions.</p>
          </>
        );
      case 6:
        const fullNameContent = formData.fullName ? <span className={styles.value}>{formData.fullName}</span> : <NotAvailable />;
        const birthDayContent = formData.birthDay ? <span className={styles.value}>{formData.birthDay}</span> : <NotAvailable />;
        const numbersContent = formData.commonNumbers ? <span className={styles.value}>{formData.commonNumbers}</span> : <NotAvailable />;
        const symbolsContent = formData.commonSymbols ? <span className={styles.value}>{formData.commonSymbols}</span> : <NotAvailable />;
        const wordsContent = formData.commonWords ? <span className={styles.value}>{formData.commonWords}</span> : <NotAvailable />;
        const testPwContent = formData.passwordTestInput ? <span className={styles.value}>{formData.passwordTestInput}</span> : <NotAvailable />;
        const otherInfoContent = formData.otherInfo ? <span className={styles.value}>{formData.otherInfo}</span> : <NotAvailable />;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontWeight: '600' }}>Review Your Information</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-color)' }}>Please check the details you provided. Ready to generate suggestions?</p>
            <ul className={styles.reviewList}>
              <li><strong>Full Name:</strong> {fullNameContent}</li>
              <li><strong>Birth Date:</strong> {birthDayContent}</li>
              <li><strong>Numbers:</strong> {numbersContent}</li>
              <li><strong>Symbols:</strong> {symbolsContent}</li>
              <li><strong>Words:</strong> {wordsContent}</li>
              <li><strong>Capitalize:</strong> <span className={styles.value}>{formData.capitalizeWords}</span></li>
              <li><strong>Replace:</strong> <span className={styles.value}>{formData.replaceLetters}</span></li>
              <li><strong>Test PW:</strong> {testPwContent}</li>
              <li><strong>Other:</strong> {otherInfoContent}</li>
            </ul>
            {error && (
              <div className={styles.errorMessage} style={{marginTop:'1rem'}}> {/* Use error message style */}
                {error}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!showResults) return null;
    if (isLoading) { return ( <div className={`${styles.resultsLoading} ${styles.card}`}> <Loader2 className="animate-spin" style={{margin:'auto', marginBottom:'0.75rem', height:'2rem', width:'2rem', color:'var(--primary-color)'}} /> <p style={{color:'var(--text-muted-color)'}}>Generating suggestions...</p> </div> ); }
    if (error) { return ( <div className={`${styles.resultsError} ${styles.card}`}> <AlertCircle style={{margin:'auto', marginBottom:'0.5rem', height:'1.5rem', width:'1.5rem'}} /> <p style={{fontWeight:'500', marginBottom:'0.25rem'}}>Error Generating Suggestions</p> <p style={{fontSize:'0.875rem', marginBottom:'1rem'}}>{error}</p> <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSm} ${styles.resultsResetButton}`} onClick={handleResetForm}> <RefreshCw /> Try Again </button> </div> ); }
    if (suggestions) { return ( <div className={`${styles.resultsSuccess} ${styles.card}`}> <h3 style={{fontSize:'1.25rem', fontWeight:'600', marginBottom:'1rem'}}>Password Suggestions</h3> {suggestions.length > 0 ? ( <ul className={styles.resultsList}> {suggestions.map((pw, index) => ( <li key={index}> <span>{pw}</span> <button className={styles.copyButton} onClick={() => copyToClipboard(pw)} aria-label="Copy password"> <Copy /> </button> </li> ))} </ul> ) : ( <p style={{color:'var(--text-muted-color)', textAlign:'center'}}>No suggestions generated.</p> )} <div className={styles.resultsResetButton} style={{marginTop:'1.5rem', textAlign:'center'}}> <button className={`${styles.button} ${styles.buttonOutline} ${styles.buttonSm}`} onClick={handleResetForm}> <RefreshCw /> Start New Search </button> </div> {/* TODO: Feedback Form */} </div> ); }
    return null;
  };

  return (
    <>
      {/* Apply card class */}
      <div className={`${styles.card} ${showResults ? 'mb-6' : ''}`}>
        {/* Apply card-header class */}
        <div className={styles.cardHeader}>
           {/* Apply progress-bar class */}
           <div className={styles.progressBar}>
              {/* Apply progress-indicator class */}
              <div className={styles.progressIndicator} style={{ transform: `translateX(-${100 - progressValue}%)` }}></div>
           </div>
           {/* Apply card-title and card-description classes */}
           <h2 className={styles.cardTitle}>Step {currentStep}: {steps[currentStep - 1].title}</h2>
           <p className={styles.cardDescription}>Provide hints to help us suggest likely passwords.</p>
        </div>

        {!showResults && (
           // Apply card-content class
           <div className={styles.cardContent}>
              {renderStepContent()}
           </div>
        )}

         {(!showResults || currentStep === TOTAL_STEPS) && (
             // Apply card-footer class
             <div className={styles.cardFooter}>
                {/* Apply button classes */}
                <button className={`${styles.button} ${styles.buttonOutline}`} onClick={prevStep} disabled={currentStep === 1 || isLoading || showResults}>
                   <ArrowLeft /> Previous
                </button>
                {currentStep === TOTAL_STEPS ? (
                   <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSubmit} disabled={isLoading || showResults}>
                     {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                     {isLoading ? 'Generating...' : 'Generate Suggestions'}
                   </button>
                ) : (
                   <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={nextStep} disabled={isLoading || showResults}>
                     Next <ArrowRight />
                   </button>
                )}
             </div>
         )}
      </div>

      {/* Render the results section below the card */}
      {renderResults()}
    </>
  );
}
