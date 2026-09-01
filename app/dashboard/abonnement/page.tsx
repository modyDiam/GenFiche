'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { PLANS_TARIFAIRES, PlanTarifaire, SubscriptionStatus } from '@/types/subscription';
import type { MoyenPaiement } from '@/types/database';

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState<'mensuel' | 'trimestriel' | 'annuel'>('trimestriel');
  const [moyenPaiement, setMoyenPaiement] = useState<MoyenPaiement>('wave');
  const [telephone, setTelephone] = useState('77 123 45 67');
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'selection' | 'paiement' | 'succes'>('selection');
  const [message, setMessage] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  // Charger le statut de l'abonnement
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/subscription?userId=demo_user');
      const data = await res.json();
      if (data.status) {
        setSubscription(data.status);
      }
    } catch (err) {
      console.error('Erreur chargement abonnement:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          moyenPaiement,
          telephone,
          userId: 'demo_user',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'initiation.');

      setTransactionRef(data.transactionId);
      setStep('paiement');
    } catch (err: any) {
      setMessage(err.message || 'Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transactionRef,
          planId: selectedPlan,
          moyenPaiement,
          userId: 'demo_user',
          status: 'success',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur confirmation.');

      setSubscription(data.abonnement);
      setStep('succes');
    } catch (err: any) {
      setMessage(err.message || 'Échec de la validation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wide">
          Tarification Adaptée au Sénégal • Franc CFA (XOF)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F2C59] tracking-tight">
          Abonnement Enseignant FASTEF
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Générez des fiches pédagogiques conformes au programme officiel sénégalais en illimité, téléchargez vos documents Word (.docx) et imprimez vos livrets A4 en 1 clic.
        </p>
      </div>

      {/* État actuel de l'abonnement */}
      {subscription && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              subscription.hasActiveSubscription
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {subscription.hasActiveSubscription ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {subscription.hasActiveSubscription
                    ? 'Abonnement Professionnel Actif'
                    : 'Période Découverte (Essai Gratuit)'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  subscription.hasActiveSubscription
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {subscription.hasActiveSubscription ? 'ACTIF' : 'GRATUIT'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {subscription.hasActiveSubscription
                  ? `Valide encore ${subscription.joursRestants} jours • Réglé par ${subscription.moyenPaiement?.toUpperCase()}`
                  : `${subscription.fichesGratuitesRestantes} fiche(s) gratuite(s) restante(s) sur votre quota de test.`}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/nouvelle-fiche"
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Créer une fiche</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Étape 1 : Choix du forfait */}
      {step === 'selection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS_TARIFAIRES.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer relative rounded-2xl p-6 transition-all border-2 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0F2C59] bg-white shadow-xl scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {plan.populaire && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-[#0F2C59] text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                      Recommandé Enseignants
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">{plan.nom}</h3>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#0F2C59] bg-[#0F2C59] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#0F2C59]">
                        {plan.prixFCFA.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs font-bold text-slate-500">FCFA</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100 mt-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Fiches illimitées (Maths & PC)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Exports Word (.docx) & PDF A4</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Programme officiel sénégalais</span>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Choix du moyen de paiement Wave / Orange Money */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0F2C59]" />
              <span>Choisissez votre moyen de paiement mobile (Sénégal) :</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option Wave */}
              <div
                onClick={() => setMoyenPaiement('wave')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  moyenPaiement === 'wave'
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1EA5FC] text-white flex items-center justify-center font-black text-sm shadow-sm">
                    🌊
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Wave Sénégal</h4>
                    <p className="text-xs text-slate-500">Validation instantanée sans frais (1%)</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    moyenPaiement === 'wave'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {moyenPaiement === 'wave' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Option Orange Money */}
              <div
                onClick={() => setMoyenPaiement('orange_money')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  moyenPaiement === 'orange_money'
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-black text-sm shadow-sm">
                    🟠
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Orange Money</h4>
                    <p className="text-xs text-slate-500">Paiement sécurisé par code secret USSD</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    moyenPaiement === 'orange_money'
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {moyenPaiement === 'orange_money' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="max-w-md space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Numéro de téléphone mobile ({moyenPaiement === 'wave' ? 'Compte Wave' : 'Compte Orange Money'}) :
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +221
                </span>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="77 123 45 67"
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              onClick={handleInitiatePayment}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Smartphone className="w-4 h-4 text-amber-400" />
              )}
              <span>
                Payer {PLANS_TARIFAIRES.find((p) => p.id === selectedPlan)?.prixFCFA.toLocaleString('fr-FR')} FCFA via {moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Étape 2 : Validation du paiement */}
      {step === 'paiement' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#0F2C59] flex items-center justify-center mx-auto text-2xl">
            {moyenPaiement === 'wave' ? '🌊' : '🟠'}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Validation du paiement {moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'}
            </h2>
            <p className="text-xs text-slate-600">
              Référence de transaction : <strong className="font-mono text-slate-900">{transactionRef}</strong>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Forfait :</span>
              <span className="font-bold text-slate-900">{PLANS_TARIFAIRES.find((p) => p.id === selectedPlan)?.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Montant à débiter :</span>
              <span className="font-bold text-[#0F2C59] text-sm">
                {PLANS_TARIFAIRES.find((p) => p.id === selectedPlan)?.prixFCFA.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Numéro destinataire :</span>
              <span className="font-semibold text-slate-900">+221 {telephone}</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-left">
            💡 <strong>Mode d'emploi :</strong> {moyenPaiement === 'wave'
              ? 'Une notification de paiement Wave est envoyée sur votre téléphone. Cliquez sur « Valider la transaction » ci-dessous pour confirmer la réception des fonds.'
              : 'Un code de confirmation USSD est envoyé sur votre carte SIM Orange. Cliquez sur « Valider la transaction » pour activer votre abonnement.'}
          </div>

          {message && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep('selection')}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Valider la transaction</span>
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 : Succès et activation */}
      {step === 'succes' && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              Abonnement Activé avec Succès !
            </h2>
            <p className="text-xs text-slate-600">
              Votre compte dispose désormais d'un accès illimité à l'ensemble du générateur FASTEF.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1 text-left">
            <div className="flex justify-between">
              <span>Forfait actif :</span>
              <strong>{PLANS_TARIFAIRES.find((p) => p.id === selectedPlan)?.nom}</strong>
            </div>
            <div className="flex justify-between">
              <span>Validité :</span>
              <strong>Jusqu'au {subscription?.dateExpiration?.split('T')[0]}</strong>
            </div>
            <div className="flex justify-between">
              <span>Moyen de paiement :</span>
              <strong className="uppercase">{moyenPaiement}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep('selection')}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Voir mon compte
            </button>
            <Link
              href="/dashboard/nouvelle-fiche"
              className="flex-1 px-4 py-2.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Générer une fiche maintenant</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
