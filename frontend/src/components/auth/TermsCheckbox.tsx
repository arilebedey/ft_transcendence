import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TermsCheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}

export default function TermsCheckbox({ value, onChange }: TermsCheckboxProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="termsAccepted" className="text-sm">
          I accept the{" "}
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="underline text-blue-600 hover:text-blue-800"
          >
            terms of service.
          </button>
        </label>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-20"
            onClick={() => setShowPopup(false)}
          ></div>

          <Card className="relative w-[480px] max-h-[600px] shadow-lg z-50 flex flex-col">
            <CardContent className="text-sm overflow-y-auto max-h-[540px] pt-4 pr-2">
            <p>
              1. Introduction : Bienvenue sur notre réseau social. En utilisant nos services, vous acceptez de respecter ces conditions générales d'utilisation (CGU) ainsi que toutes les lois applicables. Ces règles visent à garantir une expérience sûre, respectueuse et agréable pour tous les utilisateurs.
            </p>
            <p>
              2. Inscription : Pour créer un compte, vous devez fournir des informations exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités réalisées avec votre compte. Tout usage non autorisé doit être signalé immédiatement.
            </p>
            <p>
              3. Contenu des utilisateurs : Vous conservez la propriété de vos contenus, mais en publiant sur notre plateforme, vous accordez une licence non exclusive, transférable et mondiale nous permettant de les utiliser, modifier, publier et distribuer dans le cadre du service.
            </p>
            <p>
              4. Conduite des utilisateurs : Il est interdit de publier des contenus diffamatoires, illégaux, offensants ou violents. Les comportements de harcèlement, spam ou usurpation d'identité sont strictement interdits. Tout manquement peut entraîner la suspension ou la suppression de votre compte.
            </p>
            <p>
              5. Confidentialité et données personnelles : Nous collectons et utilisons certaines informations personnelles conformément à notre politique de confidentialité. Vous acceptez que vos données soient traitées pour améliorer le service et pour la publicité ciblée, si vous avez donné votre consentement.
            </p>
            <p>
              6. Publicité et promotions : Vous comprenez que nous pouvons afficher des publicités et contenus promotionnels. Vous ne devez pas interférer avec ces publicités ni les manipuler. La plateforme ne garantit pas que vous profiterez d’une exposition spécifique pour vos contenus.
            </p>
            <p>
              7. Limitation de responsabilité : Nous faisons de notre mieux pour assurer le fonctionnement de nos services, mais nous ne sommes pas responsables des interruptions, pertes de données ou dommages résultant de l'utilisation de la plateforme. Vous utilisez nos services à vos propres risques.
            </p>
            <p>
              8. Suspension et résiliation : Nous nous réservons le droit de suspendre ou de résilier votre compte si vous violez les CGU ou toute loi applicable. La suppression de votre compte ne vous libère pas de vos obligations passées, y compris celles concernant le contenu publié.
            </p>
            <p>
              9. Modifications des CGU : Nous pouvons modifier ces conditions à tout moment. Les modifications seront publiées sur notre site et entreront en vigueur immédiatement. Votre utilisation continue du service vaut acceptation des CGU mises à jour.
            </p>
            <p>
              10. Loi applicable et juridiction : Ces CGU sont régies par la législation en vigueur dans notre pays de siège social. Tout litige relatif à l’interprétation ou à l’application des présentes sera soumis aux tribunaux compétents.
            </p>
            <p>
              11. Dispositions diverses : Si une partie de ces CGU est jugée invalide ou inapplicable, les autres dispositions restent en vigueur. Le fait que nous n’exercions pas un droit ne constitue pas une renonciation à ce droit.
            </p>
            <p>
              12. Acceptation : En cochant la case « J’accepte les conditions d’utilisation » et en créant un compte, vous confirmez avoir lu, compris et accepté l’intégralité de ces CGU.
            </p>
            </CardContent>

            <CardFooter className="justify-center pt-2">
              <Button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2"
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
