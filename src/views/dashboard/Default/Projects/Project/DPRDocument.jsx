import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// ========================
// 🧱 Styles
// ========================
const styles = StyleSheet.create({
  // ================= Layout & Fonts =================
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#2563EB',
    fontFamily: 'Helvetica',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#578FCA',
    fontFamily: 'Helvetica',
  },
  text: {
    fontSize: 11,
    marginBottom: 6,
    color: '#1F3F66',
    fontFamily: 'Helvetica',
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc', // neutral grey
    marginVertical: 8,
  },

  // ================= Table =================
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc', // neutral grey border
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cellHeader: {
    flex: 1,
    backgroundColor: '#f5f5f5', // light grey
    padding: 6,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#333', // dark grey for text
    fontFamily: 'Helvetica',
  },
  cell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    fontFamily: 'Helvetica',
  },

  // ================= Images =================
  image: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  photo: {
    width: 180,
    height: 180,
    marginRight: 10,
    objectFit: 'cover',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  caption: {
    fontSize: 9,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Helvetica',
  },

  // ================= Footer =================
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    fontFamily: 'Helvetica',
  },
});

// ========================
// 🧩 Table Helper
// ========================
const Table = ({ headers, rows }) => (
  <View style={styles.table}>
    <View style={[styles.row, { borderBottomWidth: 1, borderColor: '#ccc' }]}>
      {headers.map((h, i) => (
        <Text key={i} style={styles.cellHeader}>
          {h}
        </Text>
      ))}
    </View>
    {rows.map((r, i) => (
      <View
        key={i}
        style={[styles.row, { borderBottomWidth: 1, borderColor: '#eee' }]}
      >
        {r.map((c, j) => (
          <Text key={j} style={styles.cell}>
            {String(c ?? '-')}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

// ========================
// 📄 Main Document
// ========================
const DPRDocument = ({ payload }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Daily Progress Report</Text>
      <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 8 }}>
        Date:{' '}
        {(() => {
          const d = new Date();
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        })()}
      </Text>

      {payload.logo && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Image
            style={{ width: 50, height: 50, objectFit: 'contain' }}
            src={URL.createObjectURL(payload.logo)}
          />
        </View>
      )}

      {/* ================== Project Info ================== */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Project Information</Text>
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}
        wrap // allow wrapping to next page
      >
        {/* Column 1 */}
        <View style={{ flex: 1, paddingRight: 10 }} wrap>
          <Text style={styles.text}>
            Project Name: {payload.projectName || '-'}
          </Text>
          <Text style={styles.text}>
            Project Team:{' '}
            {payload.projectMembers?.length > 0
              ? payload.projectMembers.join(', ')
              : '-'}
          </Text>
          <Text style={styles.text}>
            Reporting Period: {payload.from?.split('T')[0]} --→{' '}
            {payload.to?.split('T')[0]}
          </Text>
        </View>

        {/* Column 2 */}
        <View style={{ flex: 1, paddingLeft: 10 }} wrap>
          <Text style={styles.text}>
            Location: {payload.projectLocation || '-'}
          </Text>
          <Text style={styles.text}>
            Contract ID: {payload.contractId || '-'}
          </Text>
          <Text style={styles.text}>Weather: {payload.weather || '-'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ================== Tables ================== */}
      {['manpower', 'machinery', 'material', 'activity'].map((section) => {
        const data = payload[section];
        if (!data || !data.length) return null;

        const headersMap = {
          manpower: [
            'createdAt',
            'Type',
            'Supplier',
            'Trade',
            'Allocated',
            'Occupied',
            'Idle',
            'Remarks',
          ],
          machinery: [
            'createdAt',
            'Machinery',
            'Supplier',
            'Allocated',
            'Occupied',
            'Idle',
            'Maintainance',
            'Remarks',
          ],
          material: [
            'createdAt',
            'Material',
            'Supplier',
            'Unit',
            'Received',
            'Used',
            'Balance',
            'Remarks',
          ],
          activity: [
            'Created At',
            'Activity',
            'Item',
            'Quantity',
            'Unit',
            'Status',
            'Cost',
            'Start',
            'End',
            'Assigned To',
          ],
        };

        const rowsMap = {
          manpower: (m) => [
            m.createdAt?.split('T')[0],
            m.manPower,
            m.supplier,
            m.trade,
            m.allocated,
            m.occupied,
            m.idle,
            m.remarks,
          ],
          machinery: (m) => [
            m.createdAt?.split('T')[0],
            m.machinery,
            m.supplier,
            m.allocated,
            m.occupied,
            m.idle,
            m.maintainance,
            m.remarks,
          ],
          material: (m) => [
            m.createdAt?.split('T')[0],
            m.material,
            m.supplier,
            m.unit,
            m.received,
            m.used,
            m.balance,
            m.remarks,
          ],
          activity: (a) => [
            a.createdAt?.split('T')[0],
            a.name,
            a.itemName,
            a.quantity,
            a.unit,
            a.status,
            a.cost,
            a.startedAt?.split('T')[0],
            a.endedAt?.split('T')[0],
            a.assignedTo?.email || '-',
          ],
        };

        return (
          <View key={section} wrap>
            <Text style={styles.sectionTitle}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
            <Table
              headers={headersMap[section]}
              rows={data.map(rowsMap[section])}
              wrap // allow table to break across pages
            />
          </View>
        );
      })}

      {/* ================== Lists ================== */}
      {[
        { key: 'milestones', title: 'Key Milestones' },
        { key: 'hinderances', title: 'Hindrances' },
        { key: 'qualityObservations', title: 'Quality Observations' },
        { key: 'safetyRemarks', title: 'Safety Remarks' },
      ].map((list) => {
        const items = payload[list.key];
        if (!items || !items.length) return null;

        return (
          <View key={list.key} wrap>
            <Text style={styles.sectionTitle}>{list.title}:</Text>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}
              wrap
            >
              {items.map((item, i) => (
                <Text key={i} style={{ width: '50%', marginBottom: 8 }}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        );
      })}

      {/* ================== Photos ================== */}
      {payload.photos?.length > 0 && (
        <View wrap>
          <Text style={styles.sectionTitle}>Annexture</Text>
          <View style={styles.photoContainer} wrap>
            {payload.photos.map((p, i) => (
              <View key={i} style={{ marginBottom: 10 }} wrap>
                {p.file && p.file instanceof File ? (
                  <Image
                    src={URL.createObjectURL(p.file)}
                    style={styles.photo}
                  />
                ) : (
                  <Text>No Image</Text>
                )}
                <Text style={styles.caption}>{p.caption || '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

export default DPRDocument;
