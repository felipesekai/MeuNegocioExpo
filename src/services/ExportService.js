import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { purchaseRepository } from '../database/repository';
import { format } from 'date-fns';

export const exportPurchasesToCSV = async (productId = null) => {
    try {
        const purchases = await purchaseRepository.getAllByProduct(productId);

        let csvContent = "ID,Produto ID,Quantidade,Custo Unit.,Custo Total,Data Compra\n";

        purchases.forEach(item => {
            const date = format(new Date(item.purchasedAt), 'dd/MM/yyyy HH:mm');
            csvContent += `${item._id},${item.productId},${item.quantity},${item.unitCost},${item.totalCost},${date}\n`;
        });

        const fileName = `purchases_history_${Date.now()}.csv`;
        const fileUri = FileSystem.documentDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            alert('Compartilhamento não disponível neste dispositivo.');
        }
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Erro ao exportar histórico.');
    }
};
