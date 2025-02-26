import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaCog } from 'react-icons/fa';
import { AmountSettings, DEFAULT_SETTINGS, getSettings, saveSettings } from '../../utils/settings';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SettingsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SettingsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 600px;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  text-decoration: underline;
  margin-right: auto;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SuccessMessage = styled(motion.div)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 10;
`;

interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AmountSettings>(DEFAULT_SETTINGS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
  }, []);
  
  // Check for changes
  useEffect(() => {
    const savedSettings = getSettings();
    const hasChanged = 
      settings.moneyMin !== savedSettings.moneyMin ||
      settings.moneyMax !== savedSettings.moneyMax ||
      settings.timeMin !== savedSettings.timeMin ||
      settings.timeMax !== savedSettings.timeMax;
    
    setHasChanges(hasChanged);
  }, [settings]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue) || numValue < 0) return;
    
    setSettings(prev => ({
      ...prev,
      [name]: numValue
    }));
  }, []);
  
  const handleSave = useCallback(() => {
    // Validate settings
    const validSettings = {
      ...settings,
      moneyMin: Math.max(1, settings.moneyMin),
      moneyMax: Math.max(settings.moneyMin + 1, settings.moneyMax),
      timeMin: Math.max(1, settings.timeMin),
      timeMax: Math.max(settings.timeMin + 1, settings.timeMax)
    };
    
    saveSettings(validSettings);
    setSettings(validSettings);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, [settings]);
  
  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);
  
  const validateSettings = (): boolean => {
    return (
      settings.moneyMin > 0 &&
      settings.moneyMax > settings.moneyMin &&
      settings.timeMin > 0 &&
      settings.timeMax > settings.timeMin
    );
  };
  
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
          Back
        </BackButton>
        <Title>Settings</Title>
      </Header>
      
      <SettingsContainer>
        <SettingsSection>
          <SectionTitle>
            <FaCog />
            Amount Ranges
          </SectionTitle>
          
          <SettingsRow>
            <SettingsGroup>
              <InputGroup>
                <InputLabel htmlFor="moneyMin">Minimum Money Amount ($)</InputLabel>
                <Input
                  id="moneyMin"
                  name="moneyMin"
                  type="number"
                  min="1"
                  value={settings.moneyMin}
                  onChange={handleInputChange}
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel htmlFor="moneyMax">Maximum Money Amount ($)</InputLabel>
                <Input
                  id="moneyMax"
                  name="moneyMax"
                  type="number"
                  min={settings.moneyMin + 1}
                  value={settings.moneyMax}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </SettingsGroup>
            
            <SettingsGroup>
              <InputGroup>
                <InputLabel htmlFor="timeMin">Minimum Time Amount (minutes)</InputLabel>
                <Input
                  id="timeMin"
                  name="timeMin"
                  type="number"
                  min="1"
                  value={settings.timeMin}
                  onChange={handleInputChange}
                />
              </InputGroup>
              
              <InputGroup>
                <InputLabel htmlFor="timeMax">Maximum Time Amount (minutes)</InputLabel>
                <Input
                  id="timeMax"
                  name="timeMax"
                  type="number"
                  min={settings.timeMin + 1}
                  value={settings.timeMax}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </SettingsGroup>
          </SettingsRow>
        </SettingsSection>
      </SettingsContainer>
      
      <ButtonContainer>
        <ResetButton onClick={handleReset}>
          Reset to defaults
        </ResetButton>
        
        <SaveButton 
          onClick={handleSave}
          disabled={!validateSettings() || !hasChanges}
        >
          <FaSave />
          Save Settings
        </SaveButton>
      </ButtonContainer>
      
      {showSuccess && (
        <SuccessMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          Settings saved successfully!
        </SuccessMessage>
      )}
    </Container>
  );
}; 